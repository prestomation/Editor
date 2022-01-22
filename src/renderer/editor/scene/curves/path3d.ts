import { Nullable } from "../../../../shared/types";

import {
	AbstractMesh, Color4, CreateLineSystemVertexData, Curve3, Geometry, LinesMesh, Mesh, MeshBuilder, Scene, Vector3,
} from "babylonjs";

import { SceneFactory } from "../factory";

import { Tools } from "../../tools/tools";

import { IPath3DMeshCurve } from "./curve";

export class Path3DMesh extends LinesMesh {
	/**
	 * Defines the reference
	 */
	public curves: IPath3DMeshCurve[] = [
		{ curve: null!, nbPoints: 10, v0: new Vector3(0, 0, 0), v1: new Vector3(2.5, 2.5, -0.5), v2: new Vector3(1.5, 2, -1), v3: new Vector3(1, 1, 1) },
		{ curve: null!, nbPoints: 10, v0: new Vector3(1, 1, 1), v1: new Vector3(2.5, 2.5, -0.5), v2: new Vector3(1.5, 2, -1), v3: new Vector3(0, 3, 0) },
	];

	private _helpers: AbstractMesh[] = [];
	private _helperRef: Nullable<Mesh> = null;

	/**
	 * Constructor.
	 * @param name The value used by scene.getMeshByName() to do a lookup.
	 * @param scene The scene to add this mesh to.
	 */
	public constructor(name: string, scene: Scene) {
		super(name, scene);

		this.color.set(1, 0, 0);

		this.isPickable = false;
		this.doNotSerialize = true;

		const geometry = new Geometry(name, scene, undefined, true);
		geometry.applyToMesh(this);

		const metadata = Tools.GetMeshMetadata(this);
		metadata.notPickable = true;
		metadata.isHelperComponent = true;

		this.hide();
		this.buildCurves();
		this.updateCurveGeometry();
	}

	/**
	 * Builds all the curves.
	 */
	public buildCurves(): void {
		this.curves.forEach((c) => {
			c.curve = Curve3.CreateCubicBezier(c.v0, c.v1, c.v2, c.v3, c.nbPoints);
		});
	}

	/**
	 * Updates the reference of the curve in the given curve object.
	 * @param curve defines the reference to the curve object to update.
	 */
	public updateCurve(curve: IPath3DMeshCurve): void {
		curve.curve = Curve3.CreateCubicBezier(curve.v0, curve.v1, curve.v2, curve.v3, curve.nbPoints);
	}

	/**
	 * Builds the final curve and returns the list of all points of the curve.
	 */
	public getFinalCurvePoints(): Vector3[] {
		this.buildCurves();

		const points: Vector3[] = [];

		this.curves.forEach((c) => {
			points.push.apply(points, c.curve.getPoints());
		});

		return points;
	}

	/**
	 * Updates the curve geometry of the current mesh.
	 */
	public updateCurveGeometry(): void {
		this._updateCurveGeometry(true);
	}

	/**
	 * Updates the curve geometry of the current mesh.
	 */
	private _updateCurveGeometry(updateHelpers: boolean): void {
		const points = this.getFinalCurvePoints();
		const colors = points.map(() => new Color4(this.color.r, this.color.g, this.color.b, 1));

		const vd = CreateLineSystemVertexData({
			lines: [points],
			colors: [colors],
		});

		this._geometry!.setAllVerticesData(vd, true);

		if (updateHelpers && this.isVisible) {
			this._showHelpers();
		}
	}

	/**
	 * Shows the path 3d mesh.
	 * Sets the mesh visible and creates the helpers.
	 */
	public show(): void {
		this.isVisible = true;
		this._showHelpers();
	}

	/**
	 * Hides the path 3d mesh.
	 * Sets the mesh not visible and disposes all the helpers.
	 */
	public hide(): void {
		this.isVisible = false;
		this._hideHelpers();
	}

	/**
	 * Shows the helpers.
	 */
	private _showHelpers(): void {
		let curveStart = 0;
		const points = this.getFinalCurvePoints();

		this.curves.forEach((c, index) => {
			const s = this._getHelper(index);
			s.position.copyFrom(points[curveStart]);

			curveStart += c.nbPoints;
		});

		// Add last point
		const s = this._getHelper(this.curves.length);
		s.position.copyFrom(points[points.length - 1]);

		// Remove last helpers
		for (let i = this._helpers.length - 1; i > this.curves.length; i--) {
			this._helpers[i].dispose();
			this._helpers.splice(i, 1);
		}
	}

	/**
	 * Creates and returns the reference to a helper (sphere).
	 */
	private _getHelper(index: number): AbstractMesh {
		let helper = this._helpers[index];

		helper = helper ?? (this._helperRef ? this._helperRef.createInstance("helper") : (this._helperRef = MeshBuilder.CreateSphere("helper", {
			segments: 16,
			diameter: 0.1,
		})));

		this._helpers.push(helper);

		SceneFactory._SetMeshAsHelper(helper, () => {
			let v0: Vector3 = Vector3.Zero();
			let v3: Vector3 = Vector3.Zero();

			if (index === this.curves.length) {
				v3 = this.curves[index - 1].v3;
			} else if (index > 0) {
				v0 = this.curves[index].v0;
				v3 = this.curves[index - 1].v3;
			} else {
				v0 = this.curves[index].v0;
			}

			v0.copyFrom(helper.position);
			v3.copyFrom(helper.position);

			this._updateCurveGeometry(false);
		});

		return helper;
	}

	/**
	 * Hides all the visible helpers.
	 */
	public _hideHelpers(): void {
		this._helpers.forEach((h) => {
			h.dispose();
		});

		this._helpers = [];
		this._helperRef = null;
	}

	/**
	 * Gets the class name
	 * @returns the string "Mesh".
	 */
	public getClassName(): string {
		return "Path3DMesh";
	}
}
