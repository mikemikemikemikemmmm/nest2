@echo off
xcopy "./client/dist" "./docs/client" /E /Y /I
xcopy "./staff/dist" "./docs/staff" /E /Y /I