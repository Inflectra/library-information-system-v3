pushd %~dp0
dotnet publish -c Release -o ..\publish\ -r win-x64 --self-contained true -p:PublishTrimmed=true -p:PublishReadyToRun=true
"c:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC\14.35.32215\bin\Hostx64\x64\editbin.exe" /subsystem:windows ..\publish\LisApp.exe
popd