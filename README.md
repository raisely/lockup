## Lock Up 🔐

Easily remove and restore sensitive files from your Mac.

Sadly today, when travelling with a laptop, you need to [remove sensitive
information](https://medium.com/raisely/preparing-your-devices-for-airport-security-9c3e69d103cd)
 before passing through Airport Security.

This is a configurable node application to make the process for an
individual or an organisation easier.

Lockup will ask you about what apps you wish to secure, compile the relevant files
into a zip, and upload it to cloud storage.

At the other end you can run `npx lockup restore` to download and restore
all the files.

### Supported Apps/Files
Module | Description
-------+--------------
Authy  | Secures Authy database
Browsers | Secures localStorage & cookies from Firefox, & Chrome
Cloud Development | Secures credentials from Google Cloud and AWS
Development | Secures .env files from development
Instructions | Module for displaying custom instructions to display before or after clean/restore
Mac Calander and Adddress | Secures calendar and address book
Mac Keychain | Secures your user account keychains
One Password | Switch one password to travel mode
Postico | Postgres data admin tool
Raisely Cli | Raisely CLI for local development
Slack | Secures slack credentials and clears cache

### A note on built-in apps & files
Many built in files apps on Mac now have restricted access. In order for lockup to
remove and restore those files, you need to grant the terminal you run lockup from
"Full Disk Access".

To do this, go to System Preferences -> Security & Privacy -> Privacy Tab -> Full Disk Access

### Files Selected

Lockup is not a backup tool. Lockup strives to stash away a minimal set of files needed to 
keep sensitive information inaccessible should an untrustworthy person use your laptop
after you have run `lockup clean`.

The aim is that this should be a quick command to run, including storing the file in cloud storage
so the aim is to minimise the number and size of files that are moved to cloud storage.

This means that between cleaning and restoring, it is not advisable to run any of the 
cleaned apps as they may not be stable or function properly.

### Installing

Lockup is built and tested on node 8. You can run it using `npx` to 
install and execute.

### Configuration

```
node index.js config
```

This will ask you which apps you wish to secure and any special details about them

### Clean

This will use the configuration to create the zip, and potentially purge cache files

You can run a clean with

```
node index.js clean
```

### Restore

Restore files. Run this after you've cleared airport security

```
node index.js restore
```
