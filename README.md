# smartKAIS
git 저장소 복사

git clone --bare http://192.168.0.5:3200/joehee/skais.git


cd smartKAIS.git

git push --mirror https://otherip/new-repository.git


# 운영
##branch 추가
>git branch <name>
or
git checkout -b <name>   [생성과 동시에 브랜치선택]

##branch 선택
>git checkout <name>

##각자 branch에서 알아서 작업 

##branch 커밋 & 푸시
>git commit -m <comment>
git push origin <branchname> [master는 생략가능]

##병합
conflict을 방지하기 위해 우선 병합 소스의 레파지토리를 pull
>git pull <branch name> 
혹은
git checkout <branch name>
git pull

변경사항 확인
>git diff <branchname> <branchname>

현재 브랜치에 병합
>git merge <source branch>

병합 후 커밋 푸시
>git add <파일, *>
git commit -m <comment>
git push origin <branch>




 