'use strict';

/**
 * F4D MetaData 클래스
 * 
 * @alias MetaData
 * @class MetaData
 */
var MetaData = function() 
{
	if (!(this instanceof MetaData)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.guid; // must be undefined initially.***
	this.version = "";
	this.geographicCoord; // longitude, latitude, altitude.***

	this.heading;
	this.pitch;
	this.roll;

	this.bbox; // BoundingBox.***
	this.imageLodCount;
	
	// Project_data_type (new in version 002).***************************************
	// 1 = 3d model data type (normal 3d with interior & exterior data).***
	// 2 = single building skin data type (as vWorld or googleEarth data).***
	// 3 = multi building skin data type (as Shibuya & Odaiba data).***
	// 4 = pointsCloud data type.***			
	this.projectDataType;
	//-------------------------------------------------------------------------------
	
	this.offSetX;
	this.offSetY;
	this.offSetZ;

	// Buildings octree mother size.***
	this.oct_min_x = 0.0;
	this.oct_max_x = 0.0;
	this.oct_min_y = 0.0;
	this.oct_max_y = 0.0;
	this.oct_min_z = 0.0;
	this.oct_max_z = 0.0;

	this.isSmall = false;
	this.fileLoadState = CODE.fileLoadState.READY;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param arrayBuffer 변수
 * @param readWriter 변수
 */
MetaData.prototype.deleteObjects = function() 
{
	this.guid = undefined; // must be undefined initially.***
	//this.version = undefined;
	if (this.geographicCoord)
	{ this.geographicCoord.deleteObjects(); }
	this.geographicCoord = undefined; // longitude, latitude, altitude.***

	this.heading = undefined;
	this.pitch = undefined;
	this.roll = undefined;

	if (this.bbox)
	{ this.bbox.deleteObjects(); }
	this.bbox = undefined; // BoundingBox.***
	this.imageLodCount = undefined;

	// Buildings octree mother size.***
	this.oct_min_x = undefined;
	this.oct_max_x = undefined;
	this.oct_min_y = undefined;
	this.oct_max_y = undefined;
	this.oct_min_z = undefined;
	this.oct_max_z = undefined;

	this.isSmall = undefined;
	this.fileLoadState = undefined;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param arrayBuffer 변수
 * @param readWriter 변수
 */
MetaData.prototype.parseFileHeaderAsimetricVersion = function(arrayBuffer, readWriter) 
{
	var version_string_length = 5;
	var intAux_scratch = 0;
	var bytes_readed = 0;

	if (readWriter === undefined) { readWriter = new ReaderWriter(); }

	// 1) Version(5 chars).***********
	this.version = "";
	for (var j=0; j<version_string_length; j++)
	{
		this.version += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 3) Global unique ID.*********************
	if (this.guid === undefined) { this.guid =""; }

	intAux_scratch = readWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	for (var j=0; j<intAux_scratch; j++)
	{
		this.guid += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
	}

	// 4) Location.*************************
	if (this.longitude === undefined) 
	{
		this.longitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}
	else { bytes_readed += 8; }

	if (this.latitude === undefined) 
	{
		this.latitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}
	else { bytes_readed += 8; }

	if (this.altitude === undefined) 
	{
		this.altitude = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	}
	else { bytes_readed += 4; }

	if (this.bbox === undefined) { this.bbox = new BoundingBox(); }

	// 6) BoundingBox.************************
	this.bbox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
	this.bbox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

	var isLarge = false;
	if (this.bbox.maxX - this.bbox.minX > 40.0 || this.bbox.maxY - this.bbox.minY > 40.0) 
	{
		isLarge = true;
	}

	if (!isLarge && this.bbox.maxZ - this.bbox.minZ < 30.0) 
	{
		this.isSmall = true;
	}
	
	// if header version is "0.0.2", then must read extra parameters.***
	if (this.version === "0.0.2")
	{
		// parse dataType (unsigned short).***
		this.projectDataType = (new Uint16Array(arrayBuffer.slice(bytes_readed, bytes_readed+2)))[0]; bytes_readed += 2;
		
		// parse Project's offSet (double x 6).***
		this.offSetX = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
		this.offSetY = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
		this.offSetZ = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
	}

	return bytes_readed;
};























