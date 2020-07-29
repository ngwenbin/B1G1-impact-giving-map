import React, { useMemo } from 'react';
import StaticMap from 'react-map-gl';
import { DeckGL, ScatterplotLayer, ArcLayer } from 'deck.gl';
// import GL from '@luma.gl/constants';
import { easeBackInOut, easeExpIn } from 'd3';
import { useHistory } from "react-router-dom";

const Map = ({
  width,
  height,
  viewState,
  onViewStateChange,
  businessEnabled,
  projectEnabled,
  updates,
  marker,
  pulsate,
  giving,
  searchbusiness,
  token
}) => {
  const searchBusinessGivings = useMemo(() => giving.filter(items => items.id === searchbusiness.id), [giving, searchbusiness])

  const history = useHistory();

  const layers = [
    new ScatterplotLayer({
      id: 'scatter-layer-business',
      data : marker[0],
      getPosition: d => [parseFloat(d.position[0]), parseFloat(d.position[1])],
      getFillColor: businessEnabled? [0, 180, 235] : [0, 180, 235],
      radiusMaxPixels: 8,
      opacity: 1,
      getRadius: businessEnabled? 10000 : 0,
      stroked : true,
      lineWidthMinPixels: 1,
      radiusScale : 20,
      pickable: true,
      onClick: info => history.push(`/share?id=${info.object.id}`),
      getLineColor: d => [255, 255, 255],
      transitions: {
        getFillColor: 1000,
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
      getFillColor: projectEnabled? [255,170,0] : [255,159,60],
      radiusMaxPixels: 8,
      opacity: 1,
      getRadius: projectEnabled? 10000 : 0,
      stroked : true,
      lineWidthMinPixels: 1,
      radiusScale : 20,
      pickable: false,
      getLineColor: d => [255, 255, 255],
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
      getFillColor: [255, 170, 0],
      radiusMaxPixels: 20,
      radiusMinPixels: 35000,
      opacity: pulsate? 0.3 : 0,
      getRadius: 35000,
      radiusScale: 10,
      transitions: {
        opacity: 400,
        easing: easeExpIn(4)
      },
    }),

    new ArcLayer({
      id: 'arc-layer-searchbusiness',
      data: searchBusinessGivings,
      getSourcePosition: d => [parseFloat(d.source[1]), parseFloat(d.source[0])],
      getTargetPosition: d => [parseFloat(d.target[1]), parseFloat(d.target[0])],
      getSourceColor: [0, 180, 235],
      getTargetColor: [255, 170, 0],
      getHeight: 0.7,
      opacity: 0.5,
      getWidth: 1.5,
      // luma GL for blending colours together.
      // parameters: {
      //   [GL.DEPTH_TEST]: false,
      //   [GL.BLEND]: true,
      //   [GL.BLEND_DST_RGB]: GL.ONE,
      //   [GL.BLEND_EQUATION]: GL.FUNC_ADD,
      // },
    }),

    new ScatterplotLayer({
      id: 'searchbusiness-business-marker',
      data : searchBusinessGivings,
      getPosition: d => [parseFloat(d.source[1]), parseFloat(d.source[0])],
      getFillColor: [0, 180, 235],
      radiusMaxPixels: 8,
      opacity: 1,
      getRadius: 10000,
      stroked : true,
      lineWidthMinPixels: 1,
      radiusScale : 35,
      getLineColor: d => [255, 255, 255],
    }),

    new ScatterplotLayer({
      id: 'searchbusiness-project-marker',
      data : searchBusinessGivings,
      getPosition: d => [parseFloat(d.target[1]), parseFloat(d.target[0])],
      getFillColor: [255,170,0],
      radiusMaxPixels: 8,
      opacity: 1,
      getRadius: 10000,
      stroked : true,
      lineWidthMinPixels: 1,
      radiusScale : 20,
      getLineColor: d => [255, 255, 255],
    }),

];
  return (
    <StaticMap
      width={width}
      height={height}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      mapboxApiAccessToken={token}
      mapStyle="MAP_STYLE"
    >
    <DeckGL layers={layers} viewState={viewState}/>
    </StaticMap>
  );
}

export default Map