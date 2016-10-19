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

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.*;

import java.util.List;

public class MainActivity extends CordovaActivity
{
    private SSO sso_;
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        sso_ = new SSO(MainActivity.this);
        sso_.bind();
        // Set by <content src="index.html" /> in config.xml

        loadUrl(launchUrl);
        String cn = getIntent().getStringExtra("cn");
        String tel = getIntent().getStringExtra("tel");
        cn ="";
        loadUrl("javascript:var cn=\"" + cn + "\";var telnum=\"" + tel + "\";");

        new PushReceiverRegister(this).initialize();;
    }



    @Override

    protected void onPostResume() {

        super.onPostResume();

        Log.d("TestAppActivity", "onPostResume");

    }

    @Override
    protected void onPause() {

        super.onPause();

        Log.d("TestAppActivity", "onPause");

    }

    @Override

    protected void onResume() {

        super.onResume();

        Log.d("TestAppActivity", "onResume");

    }

    protected void onStop() {

        super.onStop();

        Log.d("TestAppActivity", "onStop");

    }



}
