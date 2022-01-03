### stonk-pix-db ###

### Introduction ###

# this is the database which contains all the forecasting data that gets presented to end users. 
# ml_backend will periodically write to the DB to forecasts. Backend will consume from the DB and respond back to frontend. 
# DB is a mongo-like DB which is staged in AWS DocumentDB


### Locally connecting to DocumentDB with mongodb cli ###

# Steps #

# Pull down ec2 ssh key in order to connect to EC2
# Get access


# Next pull down the DB ssl CA and store somewhere like ~/.ssh
# you'll reference this path in the following commands
wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem -P ~/.ssh


# Set up port forwarding using ec2 public IP. After, anything sent to localhost:27017 will be forwarded through the EC2
# if this fails, double check the EC2 instance is still there and the public IP matches the command
# Note - this must be actively running before proceeding to next step. 
ssh -i "~/.ssh/ssh-insilabs-keypair.pem" -L 27017:stonk-pix-db-cluster-int.cluster-cznmbr8ow7kn.us-west-2.docdb.amazonaws.com:27017 ec2-user@ec2-54-202-111-44.us-west-2.compute.amazonaws.com -N 


## CHOOSE either connection strategy ##

# mongo cli to DocumentDB
# note - replace password with actual password in Secrets manager
mongo --tlsAllowInvalidHostnames --tls --tlsCAFile ~/.ssh/rds-combined-ca-bundle.pem --username stonkpix --password <get PW in AWS Secrets manager>

# Mongo app client to DocumentDB
mongodb://stonkpix:<get PW in AWS Secrets manager>@localhost:27017/?ssl=true&ssl_ca_certs=~/.ssh/rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false


### troubleshooting ###
# make sure port forwarding is running
# check that ssl CA is in correct path, and referenced correctly in the command

