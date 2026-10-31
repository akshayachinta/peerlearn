@REM ----------------------------------------------------------------------------
@REM Root Maven Wrapper Batch Script for Windows 11 (PeerLearn Platform)
@REM Delegates cleanly to spring-boot-backend where pom.xml resides
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=."

if exist "%DIRNAME%spring-boot-backend\mvnw.cmd" (
    cd /d "%DIRNAME%spring-boot-backend"
    call mvnw.cmd %*
    exit /b %ERRORLEVEL%
) else if exist "%DIRNAME%mvnw.cmd" (
    where mvn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        mvn %*
        exit /b %ERRORLEVEL%
    )
    echo [PeerLearn] Running Maven...
    mvn %*
    exit /b %ERRORLEVEL%
) else (
    echo [PeerLearn] Error: spring-boot-backend\mvnw.cmd not found.
    exit /b 1
)
