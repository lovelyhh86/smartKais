package kr.go.juso.smartKais.camera;

import java.io.IOException;

import android.content.Context;
import android.content.res.Configuration;
import android.hardware.Camera;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

public class CameraPreview extends SurfaceView implements SurfaceHolder.Callback {
	private static final String TAG = "CameraPreview";
	final private SurfaceHolder mHolder;
	final private Camera mCamera;

	public CameraPreview(Context context, Camera camera) {
		super(context);
		mCamera = camera;

		// Install a SurfaceHolder.Callback so we get notified when the
		// underlying surface is created and destroyed.
		mHolder = getHolder();
		mHolder.addCallback(this);
		// deprecated setting, but required on Android versions prior to 3.0
		mHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);

		mHolder.setFixedSize(100, 100);
	}

	public void surfaceCreated(SurfaceHolder holder) {
		// The Surface has been created, now tell the camera where to draw the
		// preview.

		// 카메라 설정
        Camera.Parameters parameters = mCamera .getParameters();
		try {
			// 카메라의 회전이 가로/세로일때 화면을 설정한다.
            if (getResources().getConfiguration().orientation != Configuration.ORIENTATION_LANDSCAPE) {
                parameters.set("orientation", "portrait");
                mCamera.setDisplayOrientation(90);
                parameters.setRotation(90);
            } else {
                parameters.set("orientation", "landscape");
                mCamera.setDisplayOrientation(0);
                parameters.setRotation(0);
            }

			mCamera.setPreviewDisplay(holder);
			// 카메라 미리보기를 시작한다.
			mCamera.startPreview();
		} catch (IOException e) {
			Log.d("DG_DEBUG", "Error setting camera preview: " + e.getMessage());
		}

	}

	public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
		// If your preview can change or rotate, take care of those events here.
		// Make sure to stop the preview before resizing or reformatting it.

		if (mHolder.getSurface() == null) {
			// preview surface does not exist
			return;
		}

		// stop preview before making changes
		try {
			mCamera.stopPreview();
		} catch (Exception e) {
			// ignore: tried to stop a non-existent preview
			Log.d(TAG, e.getMessage());
		}

		// make any resize, rotate or reformatting changes here
		
		// start preview with new settings
		try {
			mCamera.setPreviewDisplay(mHolder);
			mCamera.startPreview();

		} catch (Exception e) {
			Log.d("DG_DEBUG", "Error starting camera preview: " + e.getMessage());
		}
	}

	public void surfaceDestroyed(SurfaceHolder holder) {
		// empty. Take care of releasing the Camera preview in your activity.
	}

}
