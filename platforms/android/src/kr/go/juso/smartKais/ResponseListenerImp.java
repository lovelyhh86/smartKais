package kr.go.juso.smartKais;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

//import com.sds.mobile.servicebrokerLib.ServiceBrokerLib;
//import com.sds.mobile.servicebrokerLib.event.ResponseEvent;
//import com.sds.mobile.servicebrokerLib.event.ResponseListener;

import com.sds.mobile.servicebrokerLib.LogUtil;
import com.sds.mobile.servicebrokerLib.ServiceBrokerLib;
import com.sds.mobile.servicebrokerLib.aidl.IRemoteService;
import com.sds.mobile.servicebrokerLib.event.ResponseEvent;
import com.sds.mobile.servicebrokerLib.event.ResponseListener;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

/**
 * Created by joehee on 16. 9. 7..
 * 공통기반 연계 클래스
 */
class ResponseListenerImp implements ResponseListener
        , ServiceBrokerLib.ServiceBrokerCB
        {

    //공통기반 ServiceBroker response 응답코드
    public static final int RES_S_OK = 0;
    public static final int RES_E_NO_SERVICE = 1;
    public static final int RES_E_NETWORK = -100;
    public static final int RES_E_TIMEOUT = -107;
    public static final int RES_E_EXCEPTION = -109;

    //Custom 결과코드
    public static final int RES_E_JSON = -10001;    //JSON형식 오류


    private final JSONArray args_;
    private final CallbackContext cbc_;
    Context context_;






/*
            ServiceConnection mSrvConn = new ServiceConnection() {
                public void onServiceDisconnected(ComponentName name) {
                    LogUtil.log_e("onServiceDisconnected");
                    ServiceBrokerLib.this.mRS = null;
                    ServiceBrokerLib.this.isBind = true;
                }

                public void onServiceConnected(ComponentName name, IBinder service) {
                    LogUtil.log_e("onServiceConnected >> :: " + ServiceBrokerLib.this.serviceId);
                    ServiceBrokerLib.this.mRS = IRemoteService.Stub.asInterface(service);
                    ServiceBrokerLib.this.isBind = true;
                    if("document".equals(ServiceBrokerLib.this.serviceId)) {
                        ServiceBrokerLib.this.sendDocument();
                    } else if("download".equals(ServiceBrokerLib.this.serviceId)) {
                        ServiceBrokerLib.this.sendDownload();
                    } else if("getInfo".equals(ServiceBrokerLib.this.serviceId)) {
                        LogUtil.log_d("info :: serviceId is getInfo ");
                    } else if("upload".equals(ServiceBrokerLib.this.serviceId)) {
                        LogUtil.log_d("info :: serviceId is upload ");
                    } else if(ServiceBrokerLib.this.serviceId != null && !"".equals(ServiceBrokerLib.this.serviceId)) {
                        ServiceBrokerLib.this.sendData();
                    } else {
                        LogUtil.log_d("info :: serviceId is null ");
                        ServiceBrokerLib.this.isService = true;
                    }

                }
            };
//*/




    public ResponseListenerImp(Context context, final JSONArray args, final CallbackContext callbackContext) {

        this.args_ = args;
        this.cbc_ = callbackContext;
        this.context_ = context;
    }

    public void request(){
        ServiceBrokerLib lib = new ServiceBrokerLib(context_, this,this);
 //       ServiceBrokerLib lib = new ServiceBrokerLib(context_, this);

        try {
            JSONObject jsonObj = args_.getJSONObject(0);
            //Object jsonParam = jsonObj.get("data");
            Intent intent = new Intent();

            Log.d("MKAISV", jsonObj.toString());

            // 지원센터에서 발급받은 서비스ID
            String scode = jsonObj.getString("scode");
            intent.putExtra("sCode", scode);
            intent.putExtra("dataType", "json");
            intent.putExtra("timeoutInterval", jsonObj.getInt("timeout"));

         //   jsonObj.remove("scode");
         //   jsonObj.remove("timeout");

            // 기간계 서버에 전달할 파라미터
            // POST 방식으로 전달됨
            // 구분자로 & 또는 ; 를 사용
     ////       String svcNm = jsonObj.getString("svcNm");
     ////       jsonObj.remove("svcNm");

     ////       StringBuilder sb = new StringBuilder();
     ////       sb.append("svcNm=").append(svcNm).append(";req=").append(jsonObj.toString());

       ////     intent.putExtra("parameter",sb.toString());
            intent.putExtra("parameter",args_.getString(1));
            Log.d("MKAISV", jsonObj.toString());

            if ("getInfo".equals(scode) == true) {
           /*
                    fc_ = new MDHBinderFacade();
                    fc_.doBindService(context_);

                    String var3 = MDHCommon.getAppName(context_);
                    Log.d("=======", var3);

                    ArrayList<String> s = new ArrayList<String>();
                    s.add("nickname");
                    s.add("company");
                    s.add("userId");

                    HashMap var4 = (HashMap) fc_.getUserInfo(s, var3);
                    Iterator var5 = s.iterator();

                    while (var5.hasNext()) {
                        String var6 = (String) var5.next();
                        Log.d("getUserInfo : ", var6);
                        String var7 = (String) var4.get(var6);
                        if (var7 != null) {
                            Log.d("result is ", var6 + ":" + var7);
                        }
                    }
                //*/
            }
            else {
                // 현장행정용 앱은 반드시 "10.1.1.10"으로 설정
                intent.putExtra("ipAddress", "10.1.1.10");
                // 현장행정용 앱은 반드시 "https"으로 설정
                intent.putExtra("connectionType", "https");
                // 행정용 앱들은 반드시 "mois/rpc" 로 기입해야 합니다.
                intent.putExtra("contextUrl", "mois/rpc");
                // 연결port
                intent.putExtra("portNumber", "443");
                // 행정용 앱들은 반드시 "json" 으로 기입해야 합니다.

            }

            lib.request(intent);

         } catch (JSONException ex)
        {ex.printStackTrace();
            cbc_.error(getExceptionResult(RES_E_JSON,"json"));
        }
    }

    private JSONObject getExceptionResult(int errCode, String data) {

        JSONObject json = new JSONObject();
        try {
            json.put("resultCode",errCode);
            json.put("resultData",new JSONObject(data));
        }catch (JSONException e)
        {
        }
        return json;
    }

    private JSONObject getSuccessResult(int sCode, String data) {

        JSONObject json = new JSONObject();
        try {
            json.put("resultCode",sCode);
            json.put("resultData",new JSONObject(data));

        }catch (JSONException e)
        {
            try {
                json.put("resultData", data);
            } catch(JSONException e1) {}
        }
        return json;
    }

   @Override
   public void onServiceBrokerResponse(String result){

       Log.d("MKAISV", "resultCode=" + result);
       cbc_.success(getSuccessResult('0', result));
   }

    @Override
    public void receive(ResponseEvent re) {

        final int resultCode = re.getResultCode();
        final String resultData = re.getResultData();

        Log.d("MKAISV", "resultCode=" + resultCode);
        Log.d("MKAISV", "resultData=" + resultData);

        ((Activity)context_) .runOnUiThread(new Runnable() {

            public void run() {
                String errorString = "";
                switch (resultCode)
                {
                    case RES_S_OK:
                        if (resultData == null || resultData.length() == 0)
                            cbc_.success(getSuccessResult(1,"{data:{}}"));
                        else
                            cbc_.success(getSuccessResult(resultCode,resultData));
                        return;
                    case RES_E_NO_SERVICE :
                        errorString = "{error:'no argument service id'}";
                        break;
                    case RES_E_NETWORK:
                        errorString = "{error:'unusable network connection'}";
                        break;
                    case RES_E_TIMEOUT :
                        errorString = "{error:'connection timeout'}";
                        break;
                    case RES_E_EXCEPTION:
                    default:
                        errorString = "{error:'exception'}";
                        break;
                }
                cbc_.error(getExceptionResult(resultCode,errorString));
            }
        });

/*
        Toast.makeText(ServiceBrokerActivity.this,
                "서비스브로커 요청결과\n" + "resultCode=" + resultCode + "\n" + "resultData=" + resultData,
                Toast.LENGTH_SHORT).show();
                //*/
    }
}
