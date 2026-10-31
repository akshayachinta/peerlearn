@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Windows (PeerLearn Project)
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@REM set %HOME% to equivalent of $HOME
if "%HOME%" == "" (set "HOME=%HOMEDRIVE%%HOMEPATH%")

set ERROR_CODE=0

@REM set local scope for variables
setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=."
set "APP_BASE_NAME=%~n0"
set "APP_HOME=%DIRNAME%"

@REM Resolve JAVA_HOME
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
goto fail

:findJavaFromJavaHome
set "JAVA_HOME=%JAVA_HOME:"=%"
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
goto fail

:init
@REM Check if system mvn is available or invoke wrapper
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    goto end
)

@REM If system mvn is not found, launch via Maven Wrapper JAR or PowerShell download
set "WRAPPER_JAR=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar"
if exist "%WRAPPER_JAR%" (
    "%JAVA_EXE%" -jar "%WRAPPER_JAR%" %*
    goto end
)

echo [PeerLearn] Downloading Maven Wrapper...
powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%WRAPPER_JAR%'"
if exist "%WRAPPER_JAR%" (
    "%JAVA_EXE%" -jar "%WRAPPER_JAR%" %*
    goto end
) else (
    echo [PeerLearn] Please install Apache Maven or place maven-wrapper.jar in .mvn/wrapper/
    goto fail
)

:fail
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
