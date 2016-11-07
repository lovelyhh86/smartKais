package kr.go.juso.smartKais;


import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

import com.sds.BizAppLauncher.sso.SSORequestKey;
import com.sds.BizAppLauncher.sso.ISSOService;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.IllegalFormatException;

public class SSO  {
    private static final String TAG = "MKAIS[SSO]";

    private static final String SSO_BIND_ACTION = "com.sds.BizAppLauncher.sso.ISSOServiceBind";

    private boolean isSSOBind_;
    private Context context_;
    private ISSOService ssoService_;
    private static HashMap<String, String> ssoInfo_ = new HashMap<String, String>();


    public SSO(Context context)
    {
        this.context_ = context;context.getApplicationContext();
        this.isSSOBind_ = false;

        ssoInfo_.put("test","test result");
        ssoInfo_.put("test Attr","test Value");
    }

    public void bind(){
        doBindService();;
    }
    private void doBindService() {
        if (!isSSOBind_){
            ComponentName  cname = ((Activity)context_).getComponentName();
            String packageName = cname.getPackageName();

            Intent intent = new Intent(SSO_BIND_ACTION);
            intent.putExtra("packageName",packageName);

            Log.d(TAG,"=== START SSO ====" + packageName);
            boolean binded = context_.getApplicationContext().bindService(intent,connection_, Context.BIND_AUTO_CREATE);

            Log.d(TAG, "BindService : " + SSO_BIND_ACTION + " : result = " + binded);
            Log.d(TAG,binded ? "=== Bind SSO ====" :  "=== Not Bind SSO ====");
        }
    }

    private void doUnbindService(){
        if (isSSOBind_)
        {
            if (ssoService_ != null)
            {
            }
            context_.getApplicationContext().unbindService(connection_);
            isSSOBind_ = false;
        }
    }


    private ServiceConnection connection_ = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Log.d(TAG,"===  SSO SERVICE Connected ====");
            // SSO 서비스 인스턴스 획득
            ssoService_ = ISSOService.Stub.asInterface(service);

            // 요청할 정보들에 해당하는 키값을 리스트에 담는다.
            ArrayList<String> keyList = new ArrayList<String>();
            /*
            keyList.add(SSORequestKey.SDS_NICKNAME);
            keyList.add(SSORequestKey.SDS_CN);
            keyList.add(SSORequestKey.SDS_DEPARTMENT);
            keyList.add(SSORequestKey.SDS_DEPARTMENTNUMBER);
            keyList.add(SSORequestKey.SDS_OU);
            keyList.add(SSORequestKey.SDS_OUCODE);
            keyList.add(SSORequestKey.SDS_SN);
            keyList.add(SSORequestKey.SDS_PARENTOUCODE);
            keyList.add(SSORequestKey.SDS_TOPOUCODE);
            */

            Class c = SSORequestKey.class;
            Field[] fs = c.getDeclaredFields();
            for (Field f : fs)
            {
                if (Modifier.isStatic(f.getModifiers())) {
                    try {
                        keyList.add((String)f.get(null));

                    }catch (IllegalAccessException e)
                    {
                    }
                }
            }

            try{
                String packageName = context_.getPackageName();
                HashMap<String, String> mobileDeskInfo = (HashMap<String, String>) ssoService_
                        .getUserInfo(keyList, packageName);
                HashMap<String, String> result = new HashMap<String, String>();
                if (mobileDeskInfo != null)
                {
                    Log.d(TAG,"===  SSO SERVICE has Object ====");
                    for (String key: keyList){
                        String value = mobileDeskInfo.get(key);
                        Log.d(TAG,key + " : "+value);
                        result.put(key,value);
                    }
                    SSO.ssoInfo_ = (HashMap<String,String>)result.clone();
                }

            }catch (RemoteException e) {
            }
            isSSOBind_ = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

            Log.d(TAG,"===  SSO SERVICE disconnected ====");
            ssoService_ = null;
            isSSOBind_ = false;
        }
    };

    public static HashMap<String,String> getSSOinfo(){
        return SSO.ssoInfo_;
    }
}
