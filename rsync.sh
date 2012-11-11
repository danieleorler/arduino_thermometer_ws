#rsync --exclude .svn -avz -e ssh -i esb.pem ../docroot/ root@ec2-50-19-68-217.compute-1.amazonaws.com./var/lib/mule/apps/bpm_chat/docroot

rsync --exclude-from 'rsync_exclude' -avz -e "ssh -i /Users/dalen/.ssh/developer" /Users/dalen/Sites/arduinothermometer/* dalen@192.168.56.101:/home/dalen/projects/arduinothermometer
