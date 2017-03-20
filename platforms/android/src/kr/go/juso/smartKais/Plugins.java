/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package kr.go.juso.smartKais;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.attachview.app.IAttachApp;
import com.sds.mobile.attachviewdata.AttachmentInfo;
import com.sds.mobile.servicebrokerLib.ServiceBrokerLib;
import com.sds.mobile.servicebrokerLib.event.ResponseListener;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;

public class Plugins extends CordovaPlugin
{
    public static final String TAG = "MkaisvPlugins";
    public static final String ATTACHMENTURL = "URL||http://10.182.78.120:50380/smartKais/mobile.proxy?";

    Context context;
    Activity activity;
    Dialog dialogProgress;

    private static CallbackContext triggerCallback_ = null;
    private static boolean isForeground_;

    public Plugins(){}


    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        activity = cordova.getActivity();
        context = (Context) activity;
        Plugins.isForeground_ = true;
    }

    @Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        Plugins.isForeground_ = false;

    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        Plugins.isForeground_ = true;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Plugins.isForeground_ = false;
    }


    @JavascriptInterface
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) {

        boolean result = false;
        String errMsg ="";
        if ("showProgress".equals(action))
        {
            errMsg = "showProgress Exception: ";
            Log.d("MKAISV", "MkaisvPlugin.showProgress");
            showProgress();

            try {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, "");
                pluginResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pluginResult);
            } catch (Exception e) {
                Log.d(TAG, errMsg + e);
            }

            result = true;
        }
        else if ("dismissProgress".equals(action))
        {
            Log.d("MKAISV", "MkaisvPlugin.dismissProgress");
            if (dialogProgress != null) {
                dialogProgress.dismiss();
            }
            result = true;
        }
        else if ("testCallback".equals(action))
        {
            Log.d("MKAISV", "MkaisvPlugin.TestCallback");
            String s  = "";

            try {
                for (int i = 0 ; i < args.length(); i++)
                {
                    String a = args.getString(i);
                    s += a.toString();
                    s+="\n";
                }
                JSONArray batchResults = new JSONArray();
                Log.d("MKAISV",s);
                //     batchResults.put("!false");
                //     callbackContext.success(s);
                //     callbackContext.error(batchResult);
                test(s,callbackContext);
                result= true;

            }catch(JSONException ex)
            {

            }
        }
        else if ("initTrigger".equals(action))
        {
            Plugins.triggerCallback_ = callbackContext;
            result = true;
        }
        else if ("testTrigger".equals(action))
        {
            Log.d("MKAISV", "MkaisvPlugin.testTrigger");
            String s  = "";

            PluginResult pr = new PluginResult(PluginResult.Status.OK, "test Trigger");
            pr.setKeepCallback(true);
            triggerCallback_.sendPluginResult(pr);
        }
        else if ("callServiceBroker".equals(action))
        {
            result = true;
            new ResponseListenerImp(context,args,callbackContext).request();

        //    result = this.CallServiceBroker_(args, callbackContext);
        }
        else if ("getSSOinfo".equals(action))
        {
            JSONObject ssoJson = SSO.getSSOInfo();
            result = true;
            callbackContext.success(ssoJson);
        }
        else if ("callAttachViewer".equals(action))
        {
            if (args.length() == 2) {
                try {
                    runAttachFileViewer(args.getString(0), args.getString(1));
                } catch (JSONException ej) {
                    Log.d("MKAISV", "MkaisvPlugin.callAttachViewer");
                }
                result = true;
            }
        }
        else if ("alertList".equals(action))
        {
            ArrayList<String> list = new ArrayList<String>();
            try {
                for (int i = 0; i < args.length(); i++) {
                    list.add(args.getString(i));
                }
            }catch (JSONException je){
                list.add("Empty Data");
            }
            CharSequence[]  cs = list.toArray(new CharSequence[list.size()]);

            new Alerter(callbackContext,context).show(cs);
            result = true;
        }
        else if ("camera".equals(action))
        {
            startCamera(callbackContext);
            result = true;
        }
        else if ("dn".equals(action))
        {
            result = true;
            try {
                new FileOpener().downloadAndOpenFile( context, args.getString(0), callbackContext);
            }catch(JSONException je){

            }catch(UnsupportedEncodingException uee){

            }
        }

        return result;
    }

    private void runAttachFileViewer(String fileName, String fileAttr)
    {
        IAttachApp attachApp = IAttachApp.getInstance();

        AttachmentInfo info = new AttachmentInfo();
        info.mAttachFileName = fileName;
        info.mAttachID = ATTACHMENTURL + fileAttr;
        attachApp.requestAttachViewer(activity, info);
    }

    private void showProgress()
    {

        if(dialogProgress == null){
            // Dialog 생성하기.
            dialogProgress = new Dialog(context);

            // Title 이 없는 Dialog 생성. 커스텀 뷰로만 Dialog를 구성하기 위해서 아래와 같이 셋팅을 해야한다.
            dialogProgress.requestWindowFeature(Window.FEATURE_NO_TITLE);

            // 커스텀 뷰를 셋팅
            dialogProgress.setContentView(R.layout.progress);

            // Dialog 를 화면의 중앙에 배치시키는 것.
            dialogProgress.getWindow().setGravity(Gravity.CENTER);

            // Dialog 바깥영역을 터치할 경우 Dialog가 Dismiss 되도록 셋팅.
            dialogProgress.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
            dialogProgress.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            // Dialog가 사라질 때 동작하도록 하기 위해서 셋팅

            dialogProgress.setCancelable(false);
        }

        dialogProgress.show();
    }

    public static boolean isIsForeground(){
        return Plugins.isForeground_;
    }
    public static void triggerNotification(JSONObject json)
    {
        Log.d("MKAISV", "MkaisvPlugin.triggerNotification");

        PluginResult pr = new PluginResult(PluginResult.Status.OK, json);
        pr.setKeepCallback(true);
        Plugins.triggerCallback_.sendPluginResult(pr);
    }

    private void test(final String s,final CallbackContext cbc)
    {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(3000);
                    cbc.success(s);

                }catch(Exception e )
                {
                }
            }
        };
        Thread test = new Thread(r);

        test.start();

        //  this.cordova.getActivity().runOnUiThread(    );

    }


    private CallbackContext cameraCallback;
    private void startCamera(final CallbackContext cbc){

        Intent intent = new Intent(context, kr.go.juso.smartKais.camera.CameraActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        cameraCallback = cbc;
        this.cordova.startActivityForResult((CordovaPlugin)this,intent,0);
     //   startActivity(intent);

    }


    public JSONObject processPicture(byte[] bitmap, String exif) {
        try {
                byte[] output = Base64.encode(bitmap, Base64.NO_WRAP);
                String js_out = new String(output);

                JSONObject json = new JSONObject();
                try {
                    json.put("src",js_out);
                    json.put("metadata",exif);

                }catch (JSONException e)
                {
                }
                return json;

        } catch (Exception e) {
     //       e.printStackTrace();
        }
        return null;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (resultCode) {
            case 1:
                byte[] results = data.getByteArrayExtra("data");
                if (results != null)
                {
                    JSONObject json = processPicture(results,"");
                    cameraCallback.success(json);

                }
                break;

            default:
                break;
        }
    }
}


class Alerter {

    final CallbackContext callbackContext_;
    final Context context_;
    public  Alerter (final CallbackContext callbackContext, Context context) {
        this.callbackContext_ = callbackContext;
        this.context_ =context;
    }

    public void show(CharSequence[]  cs )
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(this.context_);
        //    builder.setTitle();

        builder.setItems(cs, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int item) {


                ((Activity)context_) .runOnUiThread(new Runnable() {

                                                        public void run() {

                                                            callbackContext_.success(1);

                                                        }
                                                    });

            }
        });
        AlertDialog alert = builder.create();
        alert.show();
    }

}