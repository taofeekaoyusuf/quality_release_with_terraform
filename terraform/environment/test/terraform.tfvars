# Azure subscription vars
subscription_id = "1780bc89-8672-4bcd-8b0f-016eb40d22da"
client_id = "a098b3c5-cc27-41c9-9260-1b4425f2aa02"
client_secret = "mjU8Q~t3XFnYpHl4QSJmwZ8oj2CuofVHLCrncb4l"
tenant_id = "f958e84a-92b8-439f-a62d-4f45996b6d07"

# Resource Group/Location
location = "eastUS"
resource_group = "Azuredevops" # The same resource_group use to create the backend state and container
application_type = "qualityreleasewithterraform"

# Network
virtual_network_name = "qrp_vnet"
address_space = ["10.5.0.0/16"]
address_prefix_test = "10.5.1.0/24"


# Tags
demo = "qualityreleasewithterraform"