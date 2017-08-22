stty echo
echo "Enter user name to be created"
read user_name
echo "Enter password for the user $user_name"
stty -echo
read password

echo "Re-enter password for the user $user_name"
stty -echo
read confirm_password

stty echo

if [ "$password" != "$confirm_password" ]
then
  echo "*** password matching failed. You can not proceed further"
  exit
fi

node ./server/src/createUser.js --user_name=$user_name --user_password=$password
