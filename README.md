# SmartKAIS
## git 저장소 복사
```
git clone http://git.2yaa.co.kr/maniayaa/smartKais.git
```

# 운영
## branch 추가
```
git branch <name>
or
git checkout -b <name>   [생성과 동시에 브랜치선택]

## add remote branch
git checkout -b <name> origin/<name>
```

## branch 선택
```git checkout <name>```


## 각자 branch에서 알아서 작업 

## branch 커밋 & 푸시
```
git commit -m <comment>
git push origin <branchname> [master는 생략가능]
```

## 병합
conflict을 방지하기 위해 우선 병합 소스의 레파지토리를 pull
```
git pull <branch name> 
or
git checkout <branch name>
git pull
```

## 변경사항 확인
```git diff <branchname> <branchname>```


## 현재 브랜치에 병합
```git merge <source branch>```

## 특정 파일만 병합 - 시군구 구성만 변경해서 빌드하는 경우
```
git checkout master
git checkout <branchname> www/js/main.js
```

### 빌드 작업후
```
git checkout --   [롤백]
```
병합 운영관리 방법은 여러가지며 위 방법은 한 예일뿐이니  연구해서 진행


## 병합 후 커밋 푸시
```
git add <파일, *>
git commit -m <comment>
git push origin <branch>
```
