# Azure subscription vars
subscription_id = "4e780871-9657-43bf-b521-9c73706b76b1"
client_id       = "bc4703e9-b7c0-4576-b4d9-84a9ff2c53d4"
client_secret   = "OsI8Q~OM2Zd5pJPaBHEC8zsI51D5DJ1G5ruEbdoS"
tenant_id       = "f958e84a-92b8-439f-a62d-4f45996b6d07"

# Resource Group/Location
location         = "East US"
resource_group   = "Azuredevops" # The same resource_group use to create the backend state and container
application_type = "qualityreleasewithterraform"

# Network
virtual_network_name = "qrwt_vnet"
address_space        = ["10.5.0.0/16"]
address_prefix_test  = "10.5.1.0/24"

# Tags
demo = "qualityreleasewithterraform"
