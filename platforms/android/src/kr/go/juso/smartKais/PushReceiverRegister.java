package kr.go.juso.smartKais;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.dkitec.PushLibrary.Listener.PushAppRegistListener;
import com.dkitec.PushLibrary.PushLibrary;


class PushReceiverRegister implements PushAppRegistListener
{

    Context context_;
    private static final String TAG = "SmartKais[PRR]";
    private static final String SVRADDR = "https://flpush.mcenter.go.kr:7001/pis/interface";


    public PushReceiverRegister(Context context)
    {
        this.context_ = context;
    }

    public void initialize(String userid){
        PackageManager pm = context_.getPackageManager();
        String appId;
        String userId = userid;

        try {
            PackageInfo pi = pm.getPackageInfo(context_.getApplicationContext().getPackageName(), PackageManager.GET_META_DATA);
            ApplicationInfo appInfo = pi.applicationInfo;

            appId = "smartkais";
            if (appId == null)
                appId = appInfo.packageName;

        }catch (PackageManager.NameNotFoundException ne)
        {
            appId = context_.getApplicationContext().getPackageName();
        }

        int res = PushLibrary.getInstance().setStart(context_, SVRADDR, appId);
        boolean regist = PushLibrary.getInstance().AppRegist(this, userId, null);
        Log.d("-----------------------",String.valueOf(res) + "===" + String.valueOf(regist));
    }

    @Override
    public void didRegistResult(Bundle bundle)
    {
        Log.v(TAG, "PushAppRegistListener[didRegistResult]");
        String rt = bundle.getString("RT");
        String rt_msg = bundle.getString("RT_MSG");
        Log.d(TAG, "RT=" + rt);
        Log.d(TAG, "RT_MSG=" + rt_msg);

    }
}
