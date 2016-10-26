# cellmapping-frontend
Front-end to view measurements from LIMA Cell Monitor

See https://github.com/Group2000/cellmapping-frontend/wiki for a description of the front end.

# Installation
##Note
Replace ip-address in all configuration files with the ip address of the server
The installation commands are based on a Centos 7 installation<BR>
First parts have to be installed as user root.
## General parts
<pre>
yum -y install epel-release
yum -y install nodejs
yum -y install unzip

yum -y install java-1.8.0-openjdk.x86_64
yum -y install wget
wget https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/rpm/elasticsearch/2.4.1/elasticsearch-2.4.1.rpm
rpm -ivh elasticsearch-2.4.1.rpm
systemctl enable elasticsearch.service
service elasticsearch start

rpm --import https://www.rabbitmq.com/rabbitmq-signing-key-public.asc
yum -y install rabbitmq-server

chkconfig rabbitmq-server on

yum -y install npm
yum -y install git
yum -y install ruby
yum -y install ruby-devel
yum -y install bzip2
gem install json_pure
gem update --system
gem install compass
yum -y install xdg-utils

--- note pm2 = agpl license!
npm install pm2@latest -g
npm install -g grunt-cli
npm install -g bower
</pre>

## Install software
Not as root user!, For this installation is /opt used as installation directory; this can be changed.
<pre>
git clone https://github.com/Group2000/webservice-wifi.git
git clone https://github.com/Group2000/celldata-parser.git
git clone https://github.com/Group2000/webservice-cells.git
git clone https://github.com/Group2000/measurement-amqp2es.git
git clone https://github.com/Group2000/cellmapping-frontend.git

cd webservice-wifi
npm install
cd ../celldata-parser
npm install
cd ../webservice-cells
npm install
cd ../measurement-amqp2es
npm install
cd ../cellmapping-frontend
npm install
npm install grunt-google-cdn
grunt compass

</pre>
edit /opt/cellmapping-frontend/app/scripts/config.js to configure map server:
<pre>
vi /opt/cellmapping-frontend/app/scripts/config.js
</pre>
Change to:
<pre>
"use strict";

angular.module('config', [])

.constant('ENV', 'development')

.constant('WEBSERVICE', '<B>https://ip-address:3001/v1/cellmeasurements-dev</B>')

.constant('WEBSERVICEWIFI', '<B>https://ip-address:3002/v1/wifimeasurements-dev</B>')

.constant('MAXS2LEVEL', 16)

.constant('MAPSERVER', {osm:{url:'<B>http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png</B>',type:'xyz',name:'OpenStreetMap',options:{tms:false,maxZoom:22,opacity:1}},luchtfoto:{url:'https://localhost/tiles/ortho_rgb_composite/{z}/{x}/{y}.png',type:'xyz',name:'Luchtfoto',options:{tms:false,maxZoom:20,opacity:0.9}},center:{lat:52.06,lng:4.37,zoom:10}})

;
</pre>

## Install SSL key or generate self-signed for test (as user root)
<pre>
cd /etc/ssl
mkdir self-signed
cd certs
./make-dummy-cert /etc/ssl/self-signed/server.key
chmod 666 /etc/ssl/self-signed/server.key
cp /etc/ssl/self-signed/server.key /etc/ssl/self-signed/server.crt
</pre>

## RabbitMq configuration
* create the file /etc/rabbitmq/enabled_plugins with the following contents: (as user root)
<pre>
[rabbitmq_management].
</pre>

<pre>
service rabbitmq-server start
</pre>

## Zookeeper installation
As user root:
<pre>
wget http://apache.claz.org/zookeeper/zookeeper-3.4.6/zookeeper-3.4.6.tar.gz
cd /usr/local/
tar zxfv ~/zookeeper-3.4.6.tar.gz
mv zookeeper-3.4.6/ zookeeper
cp zookeeper/conf/zoo_sample.cfg zookeeper/conf/zoo.cfg
mkdir -p /var/zookeeper/data
echo "1" > /var/zookeeper/data/myid

</pre>
<pre>
root@server:/usr/local# cat zookeeper/conf/zoo.cfg

tickTime=2000
initLimit=10
syncLimit=5
dataDir=/var/zookeeper/data # <--- Important
clientPort=2181
maxClientCnxns=60
autopurge.snapRetainCount=3
autopurge.purgeInterval=1
server.1=ip-address:2888:3888 # <--- Important

#optional additional servers
server.2=ip-address2:2888:3888
server.3=ip-address3:2888:3888
</pre>

<pre>
/usr/local/zookeeper/bin/zkServer.sh start
</pre> 

<pre>
./zkCli.sh
create /dropwizard my_data
create /dropwizard/services my_data
</pre>

## PM2 configuration to run everything
<pre>
cd <Install-dir>/celldata-parser
pm2 start celldata-parser.js
cd ../cellmapping-frontend
pm2 start cellmapping-frontend.js
cd ../measurement-amqp2es
pm2 start measurement-amqp2es.js
cd ../webservice-cells
pm2 start webservice-cells.js
cd ../webservice-wifi
pm2 start webservice-wifi.js
pm2 save
</pre>
as su:
<pre>
pm2 startup centos -u user-name
vi /etc/init.d/pm2-init.sh
</pre>
edit line in /etc/init.d/pm2-init.sh:
<pre>
export PM2_HOME="/home/user-name/.pm2"
and
#super $PM2 dump

Add sleep 30 in start()
</pre>

## Fill provider data in database (NL operators)
<pre>
curl -H "Content-Type: application/json" -X POST -d '{"country":"Netherlands","iso":"NL","brand":"Vodafone","name":"Vodafone NL","mcc":204,"net":4}' -k https://ip-address:3001/v1/cellmeasurements-dev/provider
curl -H "Content-Type: application/json" -X POST -d '{"country":"Netherlands","iso":"NL","brand":"KPN","name":"KPN NL","mcc":204,"net":8}' -k https://ip-address:3001/v1/cellmeasurements-dev/provider
curl -H "Content-Type: application/json" -X POST -d '{"country":"Netherlands","iso":"NL","brand":"T-Mobile","name":"TMO NL","mcc":204,"net":16}' -k https://ip-address:3001/v1/cellmeasurements-dev/provider
curl -H "Content-Type: application/json" -X POST -d '{"country":"Netherlands","iso":"NL","brand":"Tele 2","name":"Tele2 NL","mcc":204,"net":2}' -k https://ip-address:3001/v1/cellmeasurements-dev/provider
</pre>

#Notes
Open http://hostname:9000 to go the application
When no measurements are shown, it could be that the browser doesn't accept the https key (with self-signed keys). A workaround is to type 2 URLs in the browser and accept the certificate:
<pre>
https://hostname:3001/v1/
https://hostname:3002/
</pre>
Measurement files from the Group 2000 LIMA Cell Monitor can be placed in /opt/celldata-parser/data. Data should be process automatically and moved to the processed directory.
