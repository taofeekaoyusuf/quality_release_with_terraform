# Azure subscription vars
client_id       = "eb95f4d2-1108-41ca-9fc2-d4ddf650461e"
client_secret   = "od88Q~~FNugpKKewtCmcjTmpZEo5QDxQSKmI8cIV"
subscription_id = "9264ae45-f6c6-47e0-9199-fa1b3e14415e"
tenant_id       = "9264ae45-f6c6-47e0-9199-fa1b3e14415e"

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
