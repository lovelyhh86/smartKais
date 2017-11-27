package kr.go.juso.smartKais.camera;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.hardware.Camera.PictureCallback;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.ExifInterface;
import android.os.Bundle;
import android.os.Environment;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.RotateAnimation;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import kr.go.juso.smartKais.R;

public class CameraActivity extends Activity implements SensorEventListener {
	private static final String TAG = "CameraActivity";
	private Camera mCamera;
	private CameraPreview mPreview;
	private SensorManager sensorManager = null;
	private int orientation;
	// private int deviceHeight;
	// private int deviceWidth;
	private DisplayMetrics deviceDm;

	private Button ibRetake;
	private Button ibUse;
	private Button ibCapture;


	private FrameLayout flBtnContainer;
	private LinearLayout pickBtnContainer;
	File sdRoot;
	String dir;
	private ImageView rotatingImage;

	private FrameLayout cameraPreview;
	private FrameLayout takePreview;

	private ImageView takeImage;
	private int degrees = -1;
    private int rotation = 0;
	android.support.design.widget.FloatingActionButton ac;

	private byte [] storedImage = null;
    //줌이벤트 거리계산
    float mDist = 0;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.camera);

		//button layout 배치
		LayoutInflater inflater = (LayoutInflater)getSystemService(	Context.LAYOUT_INFLATER_SERVICE);
		LinearLayout linear = (LinearLayout)inflater.inflate(R.layout.camera_btns, null);

		LinearLayout.LayoutParams paramlinear = new LinearLayout.LayoutParams(
				LinearLayout.LayoutParams.FILL_PARENT,
				LinearLayout.LayoutParams.FILL_PARENT
				);
		linear.setGravity(Gravity.BOTTOM);
		this.addContentView(linear, paramlinear);



		// Setting all the path for the image
		sdRoot = Environment.getExternalStorageDirectory();
		dir = "/DCIM/Camera/";

		// Getting all the needed elements from the layout

		cameraPreview = (FrameLayout) findViewById(R.id.camera_preview);
		takePreview = (FrameLayout) findViewById(R.id.camera_takeview);
		rotatingImage = (ImageView) findViewById(R.id.imageView1);
		takeImage =  (ImageView) findViewById(R.id.takeImageView);
		ibRetake = (Button) findViewById(R.id.ibRetake);
		ibUse = (Button) findViewById(R.id.ibUse);
		ibCapture = (Button) findViewById(R.id.ibCapture);
		flBtnContainer = (FrameLayout) findViewById(R.id.flBtnContainer);
		pickBtnContainer = (LinearLayout) findViewById(R.id.pickBtnContainer);

		// Getting the sensor service.
		sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

		// Selecting the resolution of the Android device so we can create a
		// proportional preview
		Display display = ((WindowManager) getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
		// deviceHeight = display.getHeight();
		// deviceWidth = display.getWidth();

		deviceDm = new DisplayMetrics();
		display.getMetrics(deviceDm);

				// Add a listener to the Capture button
		ibCapture.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {

				mCamera.autoFocus (new Camera.AutoFocusCallback() {

					public void onAutoFocus(boolean success, Camera camera) {

						if(success){

							mCamera.takePicture(new Camera.ShutterCallback() { @Override public void onShutter() {
								Log.d(TAG, "onShutter");
							} }, null, mPicture);

						}

					}

				});

			}
		});

		// Add a listener to the Retake button
		ibRetake.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				// Deleting the image from the SD card/
			//	File discardedPhoto = new File(sdRoot, dir + fileName);
			//	discardedPhoto.delete();

				// Restart the camera preview.
				mCamera.startPreview();
				storedImage = null;


				// Reorganize the buttons on the screen
				flBtnContainer.setVisibility(LinearLayout.VISIBLE);
				pickBtnContainer.setVisibility(LinearLayout.GONE);


				cameraPreview.setVisibility(LinearLayout.VISIBLE);
				takePreview.setVisibility(LinearLayout.GONE);
			}
		});

		// Add a listener to the Use button
		ibUse.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				// Everything is saved so we can quit the app.
				if (storedImage != null)
				{
					Intent intent = new Intent();
					intent.putExtra("data", storedImage);
					CameraActivity.this.setResult(1,intent);
				}

				finish();
			}
		});
	}

	private void createCamera() {
		// Create an instance of Camera
		mCamera = getCameraInstance();

        // Setting the right parameters in the camera
		final Camera.Parameters params = mCamera.getParameters();


		List<Camera.Size> previewSizeList = params.getSupportedPreviewSizes();
		for(Camera.Size cs : previewSizeList){
			if(cs.width / 100 == 9) {
				params.setPreviewSize(cs.width, cs.height);
				break;
			}
		}



		List<Camera.Size> sizes = params.getSupportedPictureSizes();

		if (sizes.size() > 0){
			Camera.Size sps = sizes.get(0);
			for ( Camera.Size ps : sizes ){
//				if (ps.height / 100 == 15)
//				if (ps.width / 100 == 9)
				if (ps.width / 100 == 6)
				{
					sps = ps;
					break;
				}
			}
			params.setPictureSize(sps.width,sps.height);

		}
	//	params.setPreviewSize((int)(deviceDm.widthPixels / deviceDm.density), (int)(deviceDm.heightPixels/ deviceDm.density));
		params.setPictureFormat(PixelFormat.JPEG);
		params.setJpegQuality(50);

		mCamera.setParameters(params);

		// Create our Preview view and set it as the content of our activity.
		mPreview = new CameraPreview(this, mCamera);


		LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
				(int)(deviceDm.widthPixels), (int)(deviceDm.heightPixels)
		);
//		cameraPreview.setLayoutParams(layoutParams);


		LinearLayout btnview = (LinearLayout) findViewById(R.id.linearLayout1);
		btnview.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);

		btnview.getMeasuredHeight();

		LinearLayout dummyview = (LinearLayout) findViewById(R.id.linearLayoutDummy);
		layoutParams = new LinearLayout.LayoutParams(
				(int)(deviceDm.widthPixels) - btnview.getMeasuredWidth() - 100, (int)(deviceDm.heightPixels));
		dummyview.setLayoutParams(layoutParams);

        //줌이벤트
        mPreview.setOnTouchListener(new View.OnTouchListener(){

            @Override
            public boolean onTouch(View v, MotionEvent event) {

                // Get the pointer ID
                Camera.Parameters params = mCamera.getParameters();
                int action = event.getAction();


                if (event.getPointerCount() > 1) {
                    // handle multi-touch events
                    if (action == MotionEvent.ACTION_POINTER_DOWN) {
                        mDist = getFingerSpacing(event);
                    } else if (action == MotionEvent.ACTION_MOVE && params.isZoomSupported()) {
                        mCamera.cancelAutoFocus();
                        handleZoom(event, params);
                    }
                } else {
                    // handle single touch events
                    if (action == MotionEvent.ACTION_UP) {
                        handleFocus(event, params);
                    }
                }
                return true;
            }

            private void handleZoom(MotionEvent event, Camera.Parameters params) {
                int maxZoom = params.getMaxZoom();
                int zoom = params.getZoom();
                float newDist = getFingerSpacing(event);
                //float mDist = 0;
                if (newDist > mDist) {
                    //zoom in
                    for(int i = 0 ; i < 2 ; i ++) {
                        if (zoom < maxZoom)
                            zoom++;
//                        zoom++;
                    }
                } else if (newDist < mDist) {
                    //zoom out
                    if (zoom > 0)
                        zoom--;
                        //zoom--;
                }
                mDist = newDist;
                params.setZoom(zoom);
                mCamera.setParameters(params);
            }

            public void handleFocus(MotionEvent event, Camera.Parameters params) {
                int pointerId = event.getPointerId(0);
                int pointerIndex = event.findPointerIndex(pointerId);
                // Get the pointer's current position
                float x = event.getX(pointerIndex);
                float y = event.getY(pointerIndex);

                List<String> supportedFocusModes = params.getSupportedFocusModes();
                if (supportedFocusModes != null && supportedFocusModes.contains(Camera.Parameters.FOCUS_MODE_AUTO)) {
                    mCamera.autoFocus(new Camera.AutoFocusCallback() {
                        @Override
                        public void onAutoFocus(boolean b, Camera camera) {
                            // currently set to auto-focus on single touch
                        }
                    });
                }
            }

            /** Determine the space between the first two fingers */
            private float getFingerSpacing(MotionEvent event) {
                // ...
                float x = event.getX(0) - event.getX(1);
                float y = event.getY(0) - event.getY(1);
                return (float)Math.sqrt(x * x + y * y);
            }


        });

        cameraPreview.addView(mPreview, 0);

	}

	@Override
	protected void onResume() {
		super.onResume();

		// Test if there is a camera on the device and if the SD card is
		// mounted.
		if (!checkCameraHardware(this)) {
	//		Intent i = new Intent(this, NoCamera.class);
	//		startActivity(i);
			finish();
		} else if (!checkSDCard()) {
	//		Intent i = new Intent(this, NoSDCard.class);
	//		startActivity(i);
			finish();
		}

		// Creating the camera
		createCamera();

		// Register this class as a listener for the accelerometer sensor
		sensorManager.registerListener(this, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_NORMAL);



	}

	@Override
	protected void onPause() {
		super.onPause();
		// release the camera immediately on pause event
		releaseCamera();

		// removing the inserted view - so when we come back to the app we
		// won't have the views on top of each other.

		cameraPreview.removeViewAt(0);
	}

	private void releaseCamera() {
		if (mCamera != null) {
			mCamera.release(); // release the camera for other applications
			mCamera = null;
		}
	}

	/** Check if this device has a camera */
	private boolean checkCameraHardware(Context context) {
		if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
			// this device has a camera
			return true;
		} else {
			// no camera on this device
			return false;
		}
	}

	private boolean checkSDCard() {
		boolean state = false;

		String sd = Environment.getExternalStorageState();
		if (Environment.MEDIA_MOUNTED.equals(sd)) {
			state = true;
		}

		return state;
	}

	/**
	 * A safe way to get an instance of the Camera object.
	 */
	public static Camera getCameraInstance() {
		Camera c = null;
		try {
			// attempt to get a Camera instance
			c = Camera.open();
		} catch (Exception e) {
			// Camera is not available (in use or does not exist)
			Log.d(TAG, e.getMessage());
		}

		// returns null if camera is unavailable
		return c;
	}

	final private PictureCallback mPicture = new PictureCallback() {

		public void onPictureTaken(byte[] data, Camera camera) {

			// Replacing the button after a photho was taken.
			flBtnContainer.setVisibility(View.GONE);
			pickBtnContainer.setVisibility(View.VISIBLE);

			cameraPreview.setVisibility(LinearLayout.GONE);
			takePreview.setVisibility(LinearLayout.VISIBLE);
            //프리뷰용 이미지(회전없음)
            Bitmap picbitmap = BitmapFactory.decodeByteArray(data,0,data.length); //BitmapFactory.decodeFile(pictureFile.toString());

//            fileName = "IMG_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()).toString() + ".jpg";
//            File file = new File(sdRoot, dir + fileName);
//            FileOutputStream fos = null;
//            try {
//                fos = new FileOutputStream(file);
//                fos.write(data);
//
//            } catch (Exception e) {
//                e.printStackTrace();
//            } finally {
//                try {
//                    fos.close();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//
//            try {
//                exif = new ExifInterface(file.getPath());
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//
//                int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION,
//                    ExifInterface.ORIENTATION_UNDEFINED);

            Bitmap bmRotated = rotateBitmap(picbitmap, orientation);

            byte[] newData = bitmapToByteArray(bmRotated);

            //프리뷰 이미지
			takeImage.setImageBitmap(picbitmap);
            //이미지 저장
			storedImage = newData;



			/*
			// File name of the image that we just took.
			fileName = "IMG_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()).toString() + ".jpg";

			// Creating the directory where to save the image. Sadly in older
			// version of Android we can not get the Media catalog name
			File mkDir = new File(sdRoot, dir);
			mkDir.mkdirs();

			// Main file where to save the data that we recive from the camera
			File pictureFile = new File(sdRoot, dir + fileName);

			try {
				FileOutputStream purge = new FileOutputStream(pictureFile);
				purge.write(data);
				purge.close();
			} catch (FileNotFoundException e) {
				Log.d("DG_DEBUG", "File not found: " + e.getMessage());
			} catch (IOException e) {
				Log.d("DG_DEBUG", "Error accessing file: " + e.getMessage());
			}

			// Adding Exif data for the orientation. For some strange reason the
			// ExifInterface class takes a string instead of a file.
			try {
				exif = new ExifInterface(pictureFile.toString());
				exif.setAttribute(ExifInterface.TAG_ORIENTATION, "" + orientation);
				exif.saveAttributes();
			} catch (IOException e) {
				e.printStackTrace();
			}
*/


		}
	};

	/**
	 * Putting in place a listener so we can get the sensor data only when
	 * something changes.
	 */
	public void onSensorChanged(SensorEvent event) {
		synchronized (this) {
			if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
				RotateAnimation animation = null;
				if (event.values[0] < 4 && event.values[0] > -4) {
					if (event.values[1] > 0 && orientation != ExifInterface.ORIENTATION_ROTATE_90) {
						// UP
						orientation = ExifInterface.ORIENTATION_ROTATE_90;
						animation = getRotateAnimation(270);
						degrees = 270;
                        //새로
                        rotation = 90;
					} else if (event.values[1] < 0 && orientation != ExifInterface.ORIENTATION_ROTATE_270) {
						// UP SIDE DOWN
						orientation = ExifInterface.ORIENTATION_ROTATE_270;
						animation = getRotateAnimation(90);
						degrees = 90;
                        rotation = 270;
					}
				} else if (event.values[1] < 4 && event.values[1] > -4) {
					if (event.values[0] > 0 && orientation != ExifInterface.ORIENTATION_NORMAL) {
						// LEFT
						orientation = ExifInterface.ORIENTATION_NORMAL;
						animation = getRotateAnimation(0);
						degrees = 0;
                        rotation = 0;
					} else if (event.values[0] < 0 && orientation != ExifInterface.ORIENTATION_ROTATE_180) {
						// RIGHT
						orientation = ExifInterface.ORIENTATION_ROTATE_180;
						animation = getRotateAnimation(180);
						degrees = 180;
                        rotation = 180;
					}
				}
				if (animation != null) {
					rotatingImage.startAnimation(animation);
					ImageView textView =  (ImageView) findViewById(R.id.btn_text_l);
					textView.startAnimation(animation);
					textView =  (ImageView) findViewById(R.id.btn_text_r);
					textView.startAnimation(animation);

                    if(mCamera != null){
                        Camera.Parameters params = mCamera.getParameters();

                        params.setRotation(rotation);

                        mCamera.setParameters(params);
                    }

				}
			}

		}
	}

	/**
	 * Calculating the degrees needed to rotate the image imposed on the button
	 * so it is always facing the user in the right direction
	 * 
	 * @param toDegrees
	 * @return
	 */
	private RotateAnimation getRotateAnimation(float toDegrees) {
		float compensation = 0;

		if (Math.abs(degrees - toDegrees) > 180) {
			compensation = 360;
		}

		// When the device is being held on the left side (default position for
		// a camera) we need to add, not subtract from the toDegrees.
		if (toDegrees == 0) {
			compensation = -compensation;
		}

		// Creating the animation and the RELATIVE_TO_SELF means that he image
		// will rotate on it center instead of a corner.
		RotateAnimation animation = new RotateAnimation(degrees, toDegrees - compensation, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);

		// Adding the time needed to rotate the image
		animation.setDuration(250);

		// Set the animation to stop after reaching the desired position. With
		// out this it would return to the original state.
		animation.setFillAfter(true);

		return animation;
	}

	/**
	 * STUFF THAT WE DON'T NEED BUT MUST BE HEAR FOR THE COMPILER TO BE HAPPY.
	 */
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		Log.d(TAG, "onAccuracyChanged");
	}

    public static Bitmap rotateBitmap(Bitmap bitmap, int orientation) {


        //핸드폰 버튼 기준 (카메라 값)
        //              8
        //           3  폰  1
        //              6
        //
        //
        Matrix matrix = new Matrix();
        switch (orientation) {
            case ExifInterface.ORIENTATION_NORMAL:
                return bitmap;
            case ExifInterface.ORIENTATION_FLIP_HORIZONTAL:
                matrix.setScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_ROTATE_180:
                matrix.setRotate(180);
                break;
            case ExifInterface.ORIENTATION_FLIP_VERTICAL:
                matrix.setRotate(180);
                matrix.postScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_TRANSPOSE:
                matrix.setRotate(90);
                matrix.postScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_ROTATE_90:
                matrix.setRotate(90);
                break;
            case ExifInterface.ORIENTATION_TRANSVERSE:
                matrix.setRotate(-90);
                matrix.postScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_ROTATE_270:
                matrix.setRotate(270);
                break;
            default:
                return bitmap;
        }
        try {
            Bitmap bmRotated = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
            //bitmap.recycle();
            return bmRotated;
        }
        catch (OutOfMemoryError e) {
            e.printStackTrace();
            return null;
        }
    }

    public byte[] bitmapToByteArray( Bitmap $bitmap ) {
        ByteArrayOutputStream stream = new ByteArrayOutputStream() ;
        $bitmap.compress( Bitmap.CompressFormat.JPEG, 50, stream) ;
        byte[] byteArray = stream.toByteArray() ;
        return byteArray ;
    }
}