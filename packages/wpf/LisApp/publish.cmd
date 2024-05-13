pushd %~dp0
dotnet publish -p:PublishProfile=FolderProfile
"c:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC\14.37.32822\bin\Hostx64\x64\editbin.exe" /subsystem:windows ..\publish\LisApp.exe
popd