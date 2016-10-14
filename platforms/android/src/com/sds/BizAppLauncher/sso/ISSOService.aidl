// Include your fully-qualified package statement.
package com.sds.BizAppLauncher.sso;

// See the list above for which classes need
// import statements (hint--most of them)
import com.sds.BizAppLauncher.sso.ISSOServiceCallback;


// Declare the interface.
interface ISSOService {
	
    /**
	 * Mobile MySingle 가 로그인 상태인지를 체크 확인.	 
	 * @return boolean : 로그인 true, 로그오프 및 기타 상태 false;
	 */
	boolean isSingleSignOn();
	
	
	/**
	 * 로그인 된 사용자 계정에 대한 정보를 Application 레벨에 따라 HashMap으로 리턴. 
	 * @param List<String> [in] : 가져오고자 하는 정보에 해당하는 Key(참고 :SSORequestKey.java)를 ArrayList에 담아 전달.  
	 * @param String       [in] : 호출하는 Application의 packageName. Application 레벨을 정할 때 사용됨. 
	 * @return Map 				: 파라미터로 전달된 Key에 해당하는 사용자 계정 정보
	 */	
	Map getUserInfo(in List<String> keyList, in String packageName);	
	
	
	/**
	 * Mobile MySingle 의 로그인 상태 변경을 실시간 확인하고자 할때 Callback 등록. 
	 * @param ISSOServiceCallback [in] : 로그인 상태 변경을 확인하고자 하는 ISSOServiceCallback 을 구현한 객체.	 
	 */
    void registerCallback(in ISSOServiceCallback cb);
    
    
    /**
	 * 등록된  Callback 삭제. 
	 * @param ISSOServiceCallback [in] : 전에 등록한 콜백 객체.	 
	 */     

    void unregisterCallback(in ISSOServiceCallback cb);	
	
	
	/**
	 * 화면 잠금 비번이 동일한지 체크 확인. 
	 * @param String [in] : 화면 잠금 비번.  
	 * @return booelan : 화면 잠금 동일 true, 화면 잠금 동일하지 않음 false;
	 */
	boolean checkLockPassword(in String pwd);
	
	/**
	 * 화면 잠금 상태를  체크 한다. 잠금 상태인 경우  IS_LOCKED, 잠금 상태가 아닌경우, 현재 시간으로 화면 상태를 업데이트하고  IS_UNLOCKED 리턴.
	 * Activity의 void onUserInteraction()에서 호출하도록 구현 제안. 	   
	 * @return int : NONE = 0,IS_LOCKED = 1, IS_UNLOCKED = 2,PWD_IS_NOT_SET = 3 (0~3)(참고 :SSORequestKey.java)
	 */	
    int checkLockTime();
    
    /**
	 * Accounts ID를 전달한다.  	   
	 * @return List<String> : Account ID를 전달. (멀티 계정을 대비해서 List로 리턴)
	 */
    List<String> getAccounts();
 
    /**
	 * 모바일 데스크 대한 정보를 Application 레벨에 따라 HashMap으로 리턴. 
	 * @param List<String> [in] : 가져오고자 하는 정보에 해당하는 Key(참고 :SSORequestKey.java)를 ArrayList에 담아 전달.  
	 * @param String       [in] : 호출하는 Application의 packageName. Application 레벨을 정할 때 사용됨. 
	 * @return Map 				: 파라미터로 전달된 Key에 해당하는 모바일데스크 정보 (값에 대한 정보는 문서참조)
	 */	
	Map getMobiledeskInfo(in List<String> keyList, in String packageName);
	
	
    /**
	 * 암호화된 Accounts PW를 전달한다.  	   
	 * @return String : Account Password를 전달. 
	 */
    String getUserPassword();
    
     /**
	 * 암호화된 Accounts ID를 전달한다.  	   
	 * @param String     
	 * @return String : Account ID를 전달. 
	 */
    String getUserID();
    
 
	/**
	 * 명함의 동기화가 설정상태인지 해제상태인지 확인한다.  	   
	 * @return 명함 동기화 상태(설정:true/해제:false)
	 */
	boolean getSyncContact();

	/**
	 * 일정의 동기화가 설정상태인지 해제상태인지 확인한다. <br>
	 * @return 일정 동기화 상태(설정:true/해제:false)
	 */		
	boolean getSyncSchedule();
	 
	/**
	 * 동기화 주기 및 방법을 가져온다.(4가지-0:항상/1:수동/2:30분자동/3:1시간자동) <br>
	 * @return 동기화 주기 및 방법(0~3)
	 */
	int getConnMethod();
		
	/**
	 * 동기화 시간을 가져온다. (9가지  06:00~20:00 ... 08:00~24:00) <br>
	 * @return 연결주기 시간(0~8)
	 */
	int getConnTime();
	
	/**
	 * 동기화 요일을 가져온다. (3가지-0:월~금/1:월~토/2:월~일) <br>
	 * @return 동기화 요일(0~2)
	 */
	int getConnDay();
		
	/**
	 * 해외에서의 수신여부 확인하기. <br>
	 * @return 해외에서도 수신시 true
	 */
	boolean getRoaming();
		
	/**
	 * 메일 알림음의 타이틀을 가져온다.<br>
	 * @return 메일 알림음의 타이틀
	 */	
	String getRingtoneTitle();
		
	/**
	 * 설정된 메일 알림음의 Uri 를 가져온다. <br>
	 * @return 설정된 메일 알림음의 Uri
	 */
	Uri getRingtoneUri();
		
	/**
	 * 메일 알림여부로 진동이 설정되어 있는지 여부를 가져온다. <br>
	 */
	int getVibrationNew();
	
		
	/**
	 * 메일 서명 추가할지를 알려주는 함수. <br>
	 * - 0: 메일 서명 추가 안함, 1: 메일 서명 추가함
	 */
	int getMailSignature();
	
	/**
	 * 메일 서명 String 을 넘겨주는 함수. <br>
	 */
	String getMailSignatureString();
	
	/**
	 * Remote control을 처리하는 함수. 
	 * rc : "RC01", "RC02" ... <br>
	 */
	void remoteControl(in String rc);
}