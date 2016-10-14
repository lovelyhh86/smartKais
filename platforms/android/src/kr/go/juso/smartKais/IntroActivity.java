package kr.go.juso.smartKais;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.sds.BizAppLauncher.gov.aidl.GovController;

import java.util.List;
import java.util.StringTokenizer;

/**
 * Created by joehee on 16. 9. 6..
 */
public class IntroActivity extends Activity{

    private static final String TAG = "[MFF]SampleApp";

    // 공통기반 서비스 초기화 코드
    private static final int ACTIVITY_LAUNCHER_INIT = 1;

    //*
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "IntroActivity[onCreate]");
        super.onCreate(savedInstanceState);


   //     startMainActivity("test joehee");

        // 공통기반 초기화
        GovController.getInstance(this).bindService();
        GovController.startGovActivityForResult(this, ACTIVITY_LAUNCHER_INIT);
    }
    //*/

    // GovController.startGovActivityForResult(...) 함수에 대응
    // GPKI 인증 결과를 넘겨받습니다.
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(TAG, "IntroActivity[onActivityResult]");
        super.onActivityResult(requestCode, resultCode, intent);


        if (intent != null) {
            switch (requestCode) {
                case ACTIVITY_LAUNCHER_INIT:
                    if (resultCode == Activity.RESULT_OK) {
                        // dn값 추출 및 파싱
                        String dn = intent.getStringExtra("dn");
                        String cn = "";
                        StringTokenizer st = new StringTokenizer(dn, ",");
                        while (st.hasMoreTokens()) {
                            String token = st.nextToken();
                            Log.v(TAG, "token: " + token);

                            // cn값 추출
                            if (token.startsWith("cn")) {
                                cn = token.substring(3);
                            }
                        }

                        Log.i(TAG, "공통기반 서비스 초기화 성공");
                        Log.w(TAG, "dn: " + dn);
                        Log.w(TAG, "cn: " + cn);

                        // 하이브리드 애플리케이션 시작
                        startMainActivity(cn);
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

    private void startMainActivity(String cnCode ) {

        TelephonyManager telManager = (TelephonyManager)this.getSystemService(this.TELEPHONY_SERVICE);
        String phoneNum = telManager.getLine1Number();

        // 메인 액티비티로 진행
        Intent intent = new Intent(IntroActivity.this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        intent.putExtra("cn",cnCode);
        intent.putExtra("tel",phoneNum);
        startActivity(intent);
        finish();
    }
}
