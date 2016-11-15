	var source = new ol.source.XYZ({
        url: 'http://localhost:8080/tilemill/{z}/{x}/{y}.png',
        crossOrigin: 'anonymous'
      });

      var map = new ol.Map({
        logo: false,
        layers: [
          new ol.layer.Tile({source: source})
        ],
        target: 'map',
        view: new ol.View({
          maxZoom: 18,
          center: [114.2448,30.5841],
          zoom: 11
        })
      });




	var map;
	var mapBounds = new OpenLayers.Bounds(113.942,30.4155,114.5153,30.7707);
	var mapMinZoom =11;
	var mapMaxZoom =18;
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
	OpenLayers.Util.onImageLoadErrorColor = "transparent"; 

	var options = {
		 controls: [ 
		    new OpenLayers.Control.Navigation(),
		    new OpenLayers.Control.PanZoomBar(),
		    new OpenLayers.Control.ScaleLine(),
		    new OpenLayers.Control.OverviewMap()
		    ],
		 projection: new OpenLayers.Projection("EPSG:900913"),
		 displayProjection: new OpenLayers.Projection("EPSG:4326"),
		 units: "m",
		 numZoomLevels:8,
		 //maxResolution: 156543.03390625,
		 maxExtent: new OpenLayers.Bounds(113.942,30.4155,114.5153,30.7707)
	 }; 

	//创建地图
	map = new OpenLayers.Map('map', options); 

	//获取瓦片的路径
	function overlay_getTileURL(bounds) {
		var res = this.map.getResolution();
		var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
		var y = Math.round((this.maxExtent.top-bounds.top) / (res * this.tileSize.h));
		var z = this.map.getZoom(); 
 
        if (mapBounds.intersectsBounds( bounds ) && z >= mapMinZoom && z <= mapMaxZoom ) {
        	return this.url + z + "/" + x + "/" + y+ "." + this.type;
        } else {
            return "";
        }
    } 

    //获得瓦片底图
	var tmsoverlay = new OpenLayers.Layer.TMS(
	    "背景影像",   "http://127.0.0.1:8080/tilemill/",
	    { //前面为瓦片目录
	        type: 'png',
	        getURL: overlay_getTileURL,
	        alpha: true,
	        isBaseLayer: true,
	        minResolution : 0.5971642833948135,
	        maxResolution : 156543.03390625 
	    });
	if (OpenLayers.Util.alphaHack() == false) {
		tmsoverlay.setOpacity(1);
	} 

	var wms1 = new OpenLayers.Layer.WMS("道路",
		//geoserver所在服务器地址
		"http://localhost/geoserver/wuhan/wms",
		{
			layers: "wuhan:wuhan_roads",
			transparent: true//该图层是否透明
		}
	);

	var wms2 = new OpenLayers.Layer.WMS("点状",
		//geoserver所在服务器地址
		"http://localhost/geoserver/wuhan/wms",
		{
			layers: "wuhan:wuhan_point",
			transparent: true//该图层是否透明
		}
	);

	var wms3 = new OpenLayers.Layer.WMS("服务",
		//geoserver所在服务器地址
		"http://localhost/geoserver/wuhan/ows",
		{
			layers: "wuhan:wuhan",
			transparent: false//该图层是否透明
		}
	);

	map.addLayers ([wms1,wms2,wms3,tmsoverlay] );//增加4个图层 

	map.zoomToExtent( mapBounds );
	map.addControl(new OpenLayers.Control.LayerSwitcher({}));//添加一个层切换器
	var lonLat = new OpenLayers.LonLat(114.2448,30.5841);
	//google地图需要转换坐标
	lonLat.transform(map.displayProjection,map.getProjectionObject());
	map.setCenter(lonLat, 11);
	// 注册map缩放事件
	 map.events.register("zoomend", map, onMapZoom); 

	 function onMapZoom(e){ } 
