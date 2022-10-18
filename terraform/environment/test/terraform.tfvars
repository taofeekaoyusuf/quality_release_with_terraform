# Azure subscription vars
subscription_id = "80ae9245-22ea-4f16-a42f-d5cebd7aac99"
client_id       = "c46f90e1-8790-4f57-afec-aee05880fa67"
client_secret   = "Pow8Q~ASLYoWDu911PvZqTCMibTMuopXXH8LXa~c"
tenant_id       = "f958e84a-92b8-439f-a62d-4f45996b6d07"

# Resource Group/Location
location         = "South Central US"
resource_group   = "Azuredevops" # The same resource_group use to create the backend state and container
application_type = "qualityreleasewithterraform"

# Network
virtual_network_name = "qrwt_vnet"
address_space        = ["10.5.0.0/16"]
address_prefix_test  = "10.5.1.0/24"

# Tags
demo = "qualityreleasewithterraform"
