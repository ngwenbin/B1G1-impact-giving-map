import React from "react";
import MapGL from "react-map-gl";
import { DeckGL, ScatterplotLayer, ArcLayer } from "deck.gl";
import GL from '@luma.gl/constants';
import { easeBackInOut, easeExpIn, easeLinear } from 'd3';

export default function Map({
  width,
  height,
  viewState,
  updates,
  marker,
  onViewStateChange,
  businessEnabled,
  projectEnabled,
  arcsEnabled,
  arcsEnabled2,
  pulsate,
  //connectiondata,
  impacts,
  searchmarker
}) {
  const layers = [
    new ScatterplotLayer({
      id: 'scatter-layer-business',
      data : marker[0],
      getPosition: d => [parseFloat(d.position[0]), parseFloat(d.position[1])],
      getFillColor: businessEnabled? [60, 220, 255] : [255, 255, 255],
      radiusMaxPixels: 8,
      opacity: 0.3,
      getRadius: businessEnabled? 4000 : 0,
      stroked : true,
      radiusScale : 20,
      lineWidthMinPixels: 0.3,
      parameters: {
        [GL.DEPTH_TEST]: false,
        [GL.BLEND]: true,
        [GL.BLEND_SRC_RGB]: GL.ONE,
        [GL.BLEND_DST_RGB]: GL.ONE,
        [GL.BLEND_EQUATION]: GL.FUNC_ADD,
      },
      transitions: {
        getFillColor: 600,
        getRadius: {
          duration: 1000,
          easing: easeBackInOut,
        }
      }
    }),
    new ScatterplotLayer({
      id: 'scatter-layer-project',
      data : marker[1],
      getPosition: d => [parseFloat(d.position[0]), parseFloat(d.position[1])],
      getFillColor: projectEnabled? [255,159,60] : [255, 255, 255],
      getRadius: projectEnabled? 4000 : 0,
      radiusScale : 20,
      radiusMaxPixels: 8,
      opacity: 0.3,
      stroked : true,
      lineWidthMinPixels: 0.3,
      parameters: {
        [GL.DEPTH_TEST]: false,
        [GL.BLEND]: true,
        [GL.BLEND_SRC_RGB]: GL.ONE,
        [GL.BLEND_DST_RGB]: GL.ONE,
        [GL.BLEND_EQUATION]: GL.FUNC_ADD,
      },
      transitions: {
        getFillColor: 600,
        getRadius: {
          duration: 1000,
          easing: easeBackInOut,
        }
      }
    }),
    new ScatterplotLayer({
      id: 'scatter-layer-updates',
      data: updates,
      getPosition: d => [parseFloat(d.position[1]), parseFloat(d.position[0])],
      getFillColor: [60, 220, 255],
      getRadius: 35000,
      radiusMaxPixels: 20,
      radiusMinPixels: 35000,
      opacity: pulsate? 0.3 : 0,
      radiusScale: 10,
      transitions: {
        opacity: 400,
        easing: easeExpIn(4)
      },
    }),

    // new ArcLayer({
    //   id: 'arc-layer-randomimpacts',
    //   data: connectiondata,
    //   getSourcePosition: d => [parseFloat(d.source[0]), parseFloat(d.source[1])],
    //   getTargetPosition: d => [parseFloat(d.target[0]), parseFloat(d.target[1])],
    //   getSourceColor: [60, 220, 255],
    //   getTargetColor: [255,159,60],
    //   getWidth: 1,
    //   getHeight: 0.5,
    //   opacity: arcsEnabled? 1 : 0,
    // }),

    new ArcLayer({
      id: 'arc-layer-allimpacts',
      data: impacts,
      getSourcePosition: d => [parseFloat(d.source[1]), parseFloat(d.source[0])],
      getTargetPosition: d => [parseFloat(d.target[1]), parseFloat(d.target[0])],
      getSourceColor: [60, 220, 255],
      getTargetColor: [255,159,60],
      getHeight: 0.7,
      opacity: 0.005,
      getWidth: arcsEnabled2? 0.2 : 0,
      transitions: {
        getWidth: 1000,
        easing: easeLinear
      },
      parameters: {
        [GL.DEPTH_TEST]: false,
        [GL.BLEND]: true,
        [GL.BLEND_DST_RGB]: GL.ONE,
        [GL.BLEND_EQUATION]: GL.FUNC_ADD,
      },
    }),

    new ArcLayer({
      id: 'arc-layer-searchimpacts',
      data: searchmarker,
      getSourcePosition: d => [parseFloat(d.source[1]), parseFloat(d.source[0])],
      getTargetPosition: d => [parseFloat(d.target[1]), parseFloat(d.target[0])],
      getSourceColor: [60, 220, 255],
      getTargetColor: [255,159,60],
      getHeight: 0.7,
      opacity: 0.005,
      getWidth: 0.2,
      parameters: {
        [GL.DEPTH_TEST]: false,
        [GL.BLEND]: true,
        [GL.BLEND_DST_RGB]: GL.ONE,
        [GL.BLEND_EQUATION]: GL.FUNC_ADD,
      },
    }),

];
  //
  return (
    <MapGL
      width={width}
      height={height}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      minZoom={1.4}
      maxZoom={16.1}
      mapStyle="mapbox://styles/nwb10/ckb6ebr1c3m3p1ionkpulgc8v"
    >
    <DeckGL layers={layers} viewState={viewState}/>;
    </MapGL>
  );
}
