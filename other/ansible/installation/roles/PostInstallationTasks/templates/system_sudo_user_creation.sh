#!/bin/bash
# Script to add a user to Linux system
if [ $(id -u) -eq 0 ]; then
	username="dummyuser"
	password="dummypassword"
	ssh_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDSimMc7l+Y2BjV15xyslJEa+eXFzZhnY4LH2E5w1N3TW0754+PNQ8H3tQWT/LqgSOWoROsuTLo6QWkAmyiSMtsNWaok2v2BaG5QOOk6Ba/N28SnWXTmX/cmlGpWJa2afBi3PpAKP7fTaxsZ0f13ycsCyyLzP8efvDCGuOFOWxI25ItuqbkIFxLCeGSWImBv00DNiA37lQwIg3wvjuib42AJWEMs18B3PAxdmMVR2efWrt37v6hGBFZkMuTpweV5prZhqwH+eNq0NXFLb6l/ElWMPL+eifzvG29Iz9suQSLvbxixjrjgf1A1CQ9E4RFQ9jmQx82Q81AzoyWuoRE32tJ"
	egrep "^$username" /etc/passwd >/dev/null
	if [ $? -eq 0 ]; then
		echo "$username exists!"
		exit 1
	else
		pass=$(perl -e 'print crypt($ARGV[0], "password")' $password)
		useradd -m -s /bin/bash -p $pass $username
		[ $? -eq 0 ] && echo "User has been added to system!" || echo "Failed to add a user!"
		usermod -a -G sudo $username
		mkdir -p  /home/$username/.ssh
		echo $ssh_key >> /home/$username/.ssh/authorized_keys
		chown -R $username:$username /home/$username/.ssh

	fi
else
	echo "Only root may add a user to the system"
	exit 2
fi