resource "azurerm_network_interface" "test" {
  name                = "${var.application_type}-${var.resource_type}"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group}"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "${var.subnet_id}"
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = "${var.public_ip}"
  }
}

resource "azurerm_linux_virtual_machine" "test" {
  
  name                = "${var.application_type}-${var.resource_type}"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group}"
  size                = "Standard_B1s"
  admin_username      = "myLinuxVM"
  network_interface_ids = [azurerm_network_interface.test.id,]

  admin_ssh_key {
    username   = "dhackability"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCpNor0CTiVqm8HJpt4iPFbf7i6XsaRD8N/Qv1rr8RxX9/JNUtC6JVMXDL5+YV0Fp7iujmGzzTCyeqJxWd8Q99uq5kaHe/R8mbwrakz/hI8fGapOeJCu9l8u7yVMW3LyFIFfsN80pVDphltRNOz+QpgKV3I8s1054TSO+eV6Zcs5w8QTP6174sD30p83cM5wA2v6E00Ye+ke6OwdR1QTLb54VLx17/dBkhX95uVTqRM9/nTa/A/82m20btxbhq20ZRdhw/THF20Bb5ld2VzzjkXW/Kplfg6lSGv2fIL3FiaE548g9KvhgAdSH54XZS8Oh4NyFiyo+/Za69Yd7DutfoemH1eZerzNk5Yn9f5e3mtLPGNAXZbfHxrl81sGUx8aq++bUwP45MftO+19G5gWbMrpOsZFNPoyaxKHVGi8qfi+P4hiYX3LIIDa/FwYjKt++/qC36JvwmTHBId7wMM6zAeTys8eCmer0/05HWqgVl08qwUNVPGWPmn6w9gjBLnKLeN9GJNYQ94JNhpCdHPFPnrGzuvS/F+ztB6ERgr23tWYGu70mB/oSPXeeqMuv2NEEtj7ai21svkw2UDvSPgadkUJI2yhs5xfjjqHPyyDOGRJ92lKXjHDdPcn4xWcu9+f10xPRievo9Y0aYzWN1fWzLJrJ5QnlBpeQhYLDquIttjdQ== dfnt@dfortunate"
  }

  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

}
