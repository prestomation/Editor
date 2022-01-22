import { Nullable } from "../../../../../../shared/types";

import * as React from "react";
import { ContextMenu, Menu, MenuItem, Tree, TreeNodeInfo } from "@blueprintjs/core";

import { Path3DMesh } from "../../../../scene/curves/path3d";
import { IPath3DMeshCurve } from "../../../../scene/curves/curve";

import { Tools } from "../../../../tools/tools";

import { Icon } from "../../../../gui/icon";

import { InspectorSection } from "../../../../gui/inspector/fields/section";
import { InspectorVector3 } from "../../../../gui/inspector/fields/vector3";

import { NodeInspector, INodeInspectorState } from "../../node-inspector";
import { Inspector, IObjectInspectorProps } from "../../../inspector";

export interface IPath3DInspectorState extends INodeInspectorState {
	/**
	 * Defines the list of all available nodes in the list.
	 */
	curves: TreeNodeInfo<IPath3DMeshCurve>[];
	/**
	 * Defines the reference to the selected point in the path.
	 */
	selectedCurve?: Nullable<TreeNodeInfo<IPath3DMeshCurve>>;
}

export class Path3DInspector extends NodeInspector<Path3DMesh, IPath3DInspectorState> {
	/**
	 * Constructor.
	 * @param props defines the component's props.
	 */
	public constructor(props: IObjectInspectorProps) {
		super(props);

		this.state = {
			...this.state,
			curves: this._getTreeNodePointsInfo(),
		};
	}

	/**
	 * Called on the component did mount.
	 */
	public componentDidMount(): void {
		super.componentDidMount();

		this.selectedObject.show();
	}

	/**
	 * Called on the component will unmount.
	 */
	public componentWillUnmount(): void {
		super.componentWillUnmount();

		this.selectedObject.hide();
	}

	/**
	 * Renders the content of the inspector.
	 */
	public renderContent(): React.ReactNode {
		return (
			<>
				{this.getCommonInspector()}
				<InspectorSection title="3D Path">
					<div style={{ width: "100%", minHeight: "200px", maxHeight: "600px", overflow: "auto", backgroundColor: "#222222" }}>
						<Tree
							contents={this.state.curves}
							onNodeClick={(n) => this._handleCurveNodeClicked(n)}
							onNodeContextMenu={(n, _, e) => this._handleCurveNodeContextMenu(n, e)}
						/>
					</div>
					{this.getSelectedPointInspector()}
				</InspectorSection>
			</>
		);
	}

	/**
	 * Returns the inspector used to configure the selected point.
	 */
	protected getSelectedPointInspector(): React.ReactNode {
		if (!this.state.selectedCurve) {
			return undefined;
		}

		return (
			<>
				<InspectorSection title="Points">
					<InspectorVector3 key={Tools.RandomId()} object={this.state.selectedCurve.nodeData!} property="v0" label="Start Point" step={0.02} onChange={() => this.selectedObject.updateCurveGeometry()} />
					<InspectorVector3 key={Tools.RandomId()} object={this.state.selectedCurve.nodeData!} property="v3" label="End Point" step={0.02} onChange={() => this.selectedObject.updateCurveGeometry()} />
				</InspectorSection>
				<InspectorSection title="Control Points">
					<InspectorVector3 key={Tools.RandomId()} object={this.state.selectedCurve.nodeData!} property="v1" label="Control Point 1" step={0.02} onChange={() => this.selectedObject.updateCurveGeometry()} />
					<InspectorVector3 key={Tools.RandomId()} object={this.state.selectedCurve.nodeData!} property="v2" label="Control Point 2" step={0.02} onChange={() => this.selectedObject.updateCurveGeometry()} />
				</InspectorSection>
			</>
		);
	}

	/**
	 * Returns the list of all available nodes in the points list.
	 */
	private _getTreeNodePointsInfo(): TreeNodeInfo<IPath3DMeshCurve>[] {
		return this.selectedObject.curves.map((c, i) => ({
			id: i,
			label: `${i} - (${c.v0.x},${c.v0.y},${c.v0.z}) - (${c.v3.x})`,
			nodeData: c,
		} as TreeNodeInfo<IPath3DMeshCurve>));
	}

	/**
	 * Called on the user clicks on a node in the tree.
	 */
	private _handleCurveNodeClicked(node: TreeNodeInfo<IPath3DMeshCurve>): void {
		this.state.curves.forEach((n) => {
			n.isSelected = false;
		});

		node.isSelected = true;

		this.setState({ curves: this.state.curves, selectedCurve: node });
	}

	/**
	 * Called on the user right-clicks on a node in the tree.
	 */
	private _handleCurveNodeContextMenu(node: TreeNodeInfo<IPath3DMeshCurve>, ev: React.MouseEvent<HTMLElement, MouseEvent>): void {
		if (this.selectedObject.curves.length <= 1) {
			return;
		}

		ContextMenu.show((
			<Menu>
				<MenuItem text="Remove" icon={<Icon src="times.svg" />} onClick={() => {
					this.selectedObject.curves.splice(node.id as number, 1);
					this.selectedObject.updateCurveGeometry();

					this.setState({ curves: this._getTreeNodePointsInfo(), selectedCurve: null });
				}} />
			</Menu>
		), {
			left: ev.clientX,
			top: ev.clientY,
		});
	}
}

Inspector.RegisterObjectInspector({
	ctor: Path3DInspector,
	ctorNames: ["Path3DMesh"],
	title: "3D Path",
});
