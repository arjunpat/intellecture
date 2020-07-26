sudo yum -y update
curl -sL https://rpm.nodesource.com/setup_12.x | bash -
sudo yum -y install nodejs

curl http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm -O
sudo rpm -ivh mysql-community-release-el7-5.noarch.rpm
rm mysql-community-release-el7-5.noarch.rpm
sudo yum update
sudo yum -y install mysql-server
sudo systemctl enable mysqld
sudo systemctl start mysqld

sudo yum -y install git
sudo yum -y install epel-release
sudo yum -y install nginx
sudo systemctl enable nginx

sudo yum install python2-certbot-nginx
#sudo certbot --nginx certonly

# https://stackoverflow.com/questions/6795350/nginx-403-forbidden-for-all-files
sudo setsebool -P httpd_can_network_connect 1
setenforce Permissive

echo "1. run sudo mysql_secure_installation and setup"
echo "2. add nginx config file and restart nginx"
echo "3. disable snapshotting"
