# vSphere linked clone VM

[TOC]

Lined clone VM is the fast way to clone a VM since it do not copy all virutal disk data but using Copy-on-write for the new VM. It could clone a VM in seconds!!

##Requirement
Since the Copy-on-write mechanism, there were 2 requirement.

1. It must clone a snapshot of VM.
2. The destination Datastore of new VM must be same as the snapshot which it cloned.

## Lined clone via PwoerCli
```
PowerCLI C:\> Connect-VIServer  VCENTER_SERVER
PowerCLI C:\> New-VM -Name NEW_VM_NAME  -VM  SOURCE_VM  -Li
nkedClone  -ReferenceSnapshot SNAPSHOT_NAME  -VMHost ESXI_HOST  -Datastore DATASTORE
```