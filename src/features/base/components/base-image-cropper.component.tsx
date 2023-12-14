import {
  createRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Cropper } from 'react-cropper';
import cx from 'classix';

import { BaseButton } from './base-button.components';
import { BaseDivider } from './base-divider.component';
import { BaseRangeSlider } from './base-range-slider.component';
import { BaseSpinner } from './base-spinner.component';

import type { ChangeEvent, ComponentProps, WheelEvent } from 'react';
import type { ReactCropperElement } from 'react-cropper';
import type { IconName } from '../models/base.model';
import type { ExActImageEdit } from '#/core/models/core.model';

type Props = ComponentProps<'div'> & {
  imageData?: ExActImageEdit;
  onComplete?: (data: string | null) => void;
};

const DEFAULT_ZOOM = 0.5;
const DEFAULT_ROTATE = 0.5;
const MAX_ZOOM_TO = 0.9;
const MIN_ZOOM_TO = 0.1;
const ZOOM_RATIO = 0.01;
const MAX_ROTATE_TO = 180;
const MIN_ROTATE_TO = -180;
const ROTATE_RATIO = 1;

const defaultCropperProps = {
  style: { height: 350, width: '100%' },
  initialAspectRatio: 16 / 10,
  viewMode: 0 as Cropper.ViewMode,
  wheelZoomRatio: ZOOM_RATIO,
  zoomOnWheel: false,
  zoomOnTouch: false,
  rotateTo: 0,
  minCropBoxHeight: 10,
  minCropBoxWidth: 10,
  background: false,
  responsive: true,
  autoCropArea: 0,
  guides: true,
  dragMode: 'move' as Cropper.DragMode,
  checkOrientation: false,
};

export const BaseImageCropper = memo(function ({
  className,
  imageData,
  onComplete,
  ...moreProps
}: Props) {
  const cropperRef = createRef<ReactCropperElement>();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [zoomTo, setZoomTo] = useState(DEFAULT_ZOOM);
  const [rotateTo, setRotateTo] = useState(DEFAULT_ROTATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imageData) {
      setCurrentImage(null);
      return;
    }

    // If image data is present then set current image to edit
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImage(reader.result as any);
    };
    reader.readAsDataURL(imageData.file);
  }, [imageData]);

  const zoomImage = useCallback(
    (zoomIn: boolean) => () => {
      if (zoomIn) {
        const value = zoomTo + ZOOM_RATIO;
        setZoomTo(value >= MAX_ZOOM_TO ? MAX_ZOOM_TO : value);
      } else {
        const value = zoomTo - ZOOM_RATIO;
        setZoomTo(value <= MIN_ZOOM_TO ? MIN_ZOOM_TO : value);
      }
    },
    [zoomTo],
  );

  const rotateImage = useCallback(
    (clockwise: boolean) => () => {
      if (!cropperRef.current?.cropper) {
        return;
      }

      let finalValue = 0;
      if (clockwise) {
        const value = rotateTo + ROTATE_RATIO;
        finalValue = value >= MAX_ROTATE_TO ? MAX_ROTATE_TO : value;
      } else {
        const value = rotateTo - ROTATE_RATIO;
        finalValue = value <= MIN_ROTATE_TO ? MIN_ROTATE_TO : value;
      }

      cropperRef.current?.cropper.rotateTo(finalValue);
      setRotateTo(finalValue);
    },
    [rotateTo, cropperRef],
  );

  const zoomSliderLeftIconBtnProps = useMemo(
    () => ({
      name: 'magnifying-glass-minus' as IconName,
      tooltip: 'Zoom out',
      onClick: zoomImage(false),
    }),
    [zoomImage],
  );

  const zoomSliderRightIconBtnProps = useMemo(
    () => ({
      name: 'magnifying-glass-plus' as IconName,
      tooltip: 'Zoom in',
      onClick: zoomImage(true),
    }),
    [zoomImage],
  );

  const rotateSliderLeftIconBtnProps = useMemo(
    () => ({
      name: 'arrow-counter-clockwise' as IconName,
      tooltip: 'Rotate counter-clockwise',
      onClick: rotateImage(false),
    }),
    [rotateImage],
  );

  const rotateSliderRightIconBtnProps = useMemo(
    () => ({
      name: 'arrow-clockwise' as IconName,
      tooltip: 'Rotate clockwise',
      onClick: rotateImage(true),
    }),
    [rotateImage],
  );

  const handleZoomWheel = useCallback(
    (event: WheelEvent<HTMLInputElement>) => {
      const { deltaY } = event;

      if (deltaY === 0) {
        return;
      }

      zoomImage(deltaY > 0 ? false : true)();
    },
    [zoomImage],
  );

  const handleRotateWheel = useCallback(
    (event: WheelEvent<HTMLInputElement>) => {
      const { deltaY } = event;

      if (deltaY === 0) {
        return;
      }

      rotateImage(deltaY > 0 ? false : true)();
    },
    [rotateImage],
  );

  const handleZoomChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setZoomTo(parseFloat(value));
    },
    [],
  );

  const handleRotateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!cropperRef.current?.cropper) {
        return;
      }

      const { value } = event.target;

      cropperRef.current?.cropper.rotateTo(parseFloat(value));
      setRotateTo(parseFloat(value));
    },
    [cropperRef],
  );

  const handleInitialized = useCallback(() => {
    setLoading(false);
  }, []);

  const handleReset = useCallback(() => {
    if (!cropperRef.current?.cropper) {
      return;
    }

    cropperRef.current?.cropper.rotateTo(DEFAULT_ROTATE);
    setZoomTo(DEFAULT_ZOOM);
    setRotateTo(DEFAULT_ROTATE);
  }, [cropperRef]);

  const handleComplete = useCallback(
    (isCrop: boolean) => () => {
      if (!onComplete || !cropperRef.current?.cropper) {
        return;
      }

      if (isCrop) {
        const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
        onComplete(data);
      } else {
        onComplete(currentImage);
      }
    },
    [cropperRef, onComplete, currentImage],
  );

  return (
    <div className={cx('relative w-full', className)} {...moreProps}>
      {loading && (
        <div className='absolute left-0 top-0 z-10 flex h-full min-h-[150px] w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      )}
      <div
        className={cx(
          'w-full transition-opacity',
          loading ? 'opacity-50' : 'opacity-100',
        )}
      >
        <div
          className='relative mb-3 w-full overflow-hidden rounded-md'
          onWheel={handleZoomWheel}
        >
          {!!currentImage && (
            <Cropper
              ref={cropperRef}
              src={currentImage}
              zoomTo={zoomTo}
              onInitialized={handleInitialized}
              {...defaultCropperProps}
            />
          )}
        </div>
        <div className='flex w-full flex-col items-center gap-2.5'>
          <div className='flex items-end justify-center gap-2.5'>
            <div className='flex items-center gap-2'>
              <small>Select Image</small>
              <div className='flex items-center gap-2.5 rounded-md border border-accent/30 px-2.5 py-1'>
                <BaseButton
                  variant='link'
                  size='sm'
                  rightIconName='crop'
                  onClick={handleComplete(true)}
                >
                  With Crop
                </BaseButton>
                <BaseDivider className='!h-6' vertical />
                <BaseButton
                  variant='link'
                  size='sm'
                  rightIconName='frame-corners'
                  onClick={handleComplete(false)}
                >
                  Full Size
                </BaseButton>
              </div>
            </div>
            <div className='py-1'>
              <BaseButton
                variant='link'
                size='sm'
                rightIconName='arrow-counter-clockwise'
                onClick={handleReset}
              >
                Reset
              </BaseButton>
            </div>
          </div>
          <BaseDivider />
          <BaseRangeSlider
            min={MIN_ZOOM_TO}
            max={MAX_ZOOM_TO}
            step={ZOOM_RATIO}
            value={zoomTo}
            leftIconButtonProps={zoomSliderLeftIconBtnProps}
            rightIconButtonProps={zoomSliderRightIconBtnProps}
            onChange={handleZoomChange}
            onWheel={handleZoomWheel}
          />
          <BaseRangeSlider
            min={MIN_ROTATE_TO}
            max={MAX_ROTATE_TO}
            step={ROTATE_RATIO}
            value={rotateTo}
            leftIconButtonProps={rotateSliderLeftIconBtnProps}
            rightIconButtonProps={rotateSliderRightIconBtnProps}
            onChange={handleRotateChange}
            onWheel={handleRotateWheel}
          />
        </div>
      </div>
    </div>
  );
});
