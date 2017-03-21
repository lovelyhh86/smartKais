package kr.go.juso.smartKais;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.sds.BizAppLauncher.gov.aidl.GovController;
import com.sds.mobile.servicebrokerLib.ServiceBrokerLib;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by joehee on 16. 9. 6..
 */
public class IntroActivity extends Activity {
    private static final String TAG = "IntroActivity";

    // 공통기반 서비스 초기화 코드
    private static final int ACTIVITY_LAUNCHER_INIT = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreate");
        super.onCreate(savedInstanceState);

        // 공통기반 초기화
        GovController.getInstance(this).bindService();
        GovController.startGovActivityForResult(this, ACTIVITY_LAUNCHER_INIT);
    }

    /**
     * GovController.startGovActivityForResult(...) 함수에 대응
     * GPKI 인증 결과를 넘겨받습니다.
     *
     * @param requestCode The request code originally supplied to startActivityForResult(),
     *                    allowing you to identify who this result came from.
     * @param resultCode  The integer result code returned by the child activity through its setResult().
     * @param intent      An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(TAG, "onActivityResult");
        super.onActivityResult(requestCode, resultCode, intent);

        if (intent != null) {
            switch (requestCode) {
                case ACTIVITY_LAUNCHER_INIT:
                    if (resultCode == Activity.RESULT_OK) {
                        Log.i(TAG, "공통기반 서비스 초기화 성공");

                        // 하이브리드 애플리케이션 시작
                        startMainActivity();
                    } else {
                        // 공통기반 서비스 초기화 실패
                        // 애플리케이션을 종료합니다.
                        finish();
                    }
                    break;

                default:
                    // 애플리케이션의 비정상 동작 또는 예상하지 못한 결과
                    // 애플리케이션을 종료합니다.
                    finish();
                    break;
            }
        }
    }

    private void startMainActivity() {
        TelephonyManager telManager = (TelephonyManager) this.getSystemService(TELEPHONY_SERVICE);
        final String phoneNum = telManager.getLine1Number();

        // SSO 결과 콜백 정의
        ServiceBrokerLib.ServiceBrokerCB callback = new ServiceBrokerLib.ServiceBrokerCB() {
            @Override
            public void onServiceBrokerResponse(String result) {
                Log.d(TAG, "ServiceBrokerCB : " + result);
                try {
                    SSO.setSSOInfo(result);
                    SSO.putSSOInfo(SSO.SSO_TEL, phoneNum);
                } catch (Exception e) {
                    Log.d(TAG, "SSO information lookup failed");
                    try {
                        SSO.setSSOInfo(new JSONArray("[]"));
                    } catch (JSONException e1) { }
                } finally {
                    // 메인 액티비티로 진행 인텐트 설정
                    Intent intent = new Intent(IntroActivity.this, MainActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

                    intent.putExtra("sso", SSO.getSSOInfo().toString());
                    startActivity(intent);

                    finish();
                }

            }
        };

        Intent intent = new Intent();
        intent.putExtra("sCode", "getInfo");
        intent.putExtra("parameter", SSO.reqParam.toString());

        ServiceBrokerLib lib = new ServiceBrokerLib(this, null, callback);
        lib.request(intent);
    }
}
