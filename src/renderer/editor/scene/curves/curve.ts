import { Curve3, Vector3 } from "babylonjs";

export interface IPath3DMeshCurve {
	/**
	 * Defines the reference to the curve.
	 */
	curve: Curve3;
	/**
	 * Defines the start point of the curve.
	 */
	v0: Vector3;
	/**
	 * Defines the first control point of the curve.
	 */
	v1: Vector3;
	/**
	 * Defines the second control point of the curve.
	 */
	v2: Vector3;
	/**
	 * Defines the end point of the curve.
	 */
	v3: Vector3;
	/**
	 * Defines the number of points to generate (aka quality).
	 */
	nbPoints: number;
}
