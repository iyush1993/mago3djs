'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class MouseAction
 */
var MouseAction = function() 
{
	if (!(this instanceof MouseAction)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	// start (onMouseDown point).***
	this.strX;
	this.strY;
	this.strCamCoordPoint;
	this.strWorldPoint;
	this.strWorldPoint2;
	this.strModelViewMatrix = new Matrix4();
	this.strModelViewMatrixInv = new Matrix4();
	
	// cameraStatus.***
	this.strCamera = new Camera();
	this.strCameraTarget = new Float32Array([0.0, 0.0, 0.0]);
	
	// Camera rotation.***
	this.camRotPoint = new Point3D();
	this.camRotAxis = new Point3D();
	
};

MouseAction.prototype.saveCurrentToStart = function()
{
	this.strX = this.curX;
	this.strY = this.curY;
	
	// world point.***
	if (this.strWorldPoint === undefined)
	{ this.strWorldPoint = new Point3D(); }
	
	if (this.curWorldPoint)
	{
		this.strWorldPoint.copyFrom(this.curWorldPoint);
	}
	
	// camCoord point.***
	if (this.strCamCoordPoint === undefined)
	{ this.strCamCoordPoint = new Point3D(); }
	
	if (this.curCamCoordPoint)
	{
		this.strCamCoordPoint.copyFrom(this.curCamCoordPoint);
	}
};






































