import React from 'react';
import {
  CanvasViewSettingsModel,
  createInitialSettings,
} from './canvas-view-settings.model';
import { CanvasViewSettingsContext } from './canvas-view-settings.context';
import { Coords, Size } from '@/core/model';

interface Props {
  children: React.ReactNode;
}

export const CanvasViewSettingsProvider: React.FC<Props> = props => {
  const { children } = props;
  const [canvasViewSettings, setCanvasViewSettings] =
    React.useState<CanvasViewSettingsModel>(createInitialSettings());
  const [scrollPosition, setScrollPosition] = React.useState<Coords>({
    x: 0,
    y: 0,
  });

  const zoomIn = () =>
    setCanvasViewSettings({
      ...canvasViewSettings,
      zoomFactor: canvasViewSettings.zoomFactor * 0.9,
    });

  const zoomOut = () =>
    setCanvasViewSettings({
      ...canvasViewSettings,
      zoomFactor: canvasViewSettings.zoomFactor * 1.1,
    });

  const setCanvasSize = (canvasSize: Size) => {
    setCanvasViewSettings({
      ...canvasViewSettings,
      canvasSize,
    });
  };

  const setFilename = (filename: string) => {
    setCanvasViewSettings({
      ...canvasViewSettings,
      filename,
    });
  };

  return (
    <CanvasViewSettingsContext.Provider
      value={{
        canvasViewSettings,
        scrollPosition,
        filename: canvasViewSettings.filename,
        zoomIn,
        zoomOut,
        setCanvasSize,
        setScrollPosition,
        setFilename,
      }}
    >
      {children}
    </CanvasViewSettingsContext.Provider>
  );
};

export const useCanvasViewSettingsContext = () => {
  const context = React.useContext(CanvasViewSettingsContext);
  if (context === null) {
    throw 'useCanvasViewSettingsContext: looks like you have forgotten to add the provider on top of the app :)';
  }

  return context;
};
