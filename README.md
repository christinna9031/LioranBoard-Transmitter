# LB-Transmitter
 Current version of Transmitter. Download the latest release. 

## Change Log since the initial 4.00 version
- changed `window.onload = (event)` to `window.addEventListener('load', (event)` for loading UI
- fixed a bug where Receiver would crash when sending fake chat trigger and adding it to queue
- added Longhouse81's commit to get a variable or stack from LB without hook
- added default title for channel points test redeems if none is inputed 
- added favicon
- fixed a bug where Twitch Sub Trigger check boxes were un-checkable
- LioranBoardJSON is now not a global variable anymore and is instead fully processed in LBExtensionReceived for performance reasons

## 4.00 version

### For users
- UI is now fully responsive. Icons and abbreviations are used for very small sizes.  
- There is now one single default dark theme.    
- Installed extensions checkboxes are collapsible.  
- Added a button Hide All Tabs. 
- Transmitter remembers your last active tab through reloads.  
- Basic Alerts tab has been renamed to Twitch Triggers.    
- Test Chat Message button correctly sends subscriber badge (can specify tier and month).
- New default extension Get Profile Picture.  

#### New Status tab:
1. Version - check whether you're on the latest versions (StreamDeck current version will not be detected)   
2. Appearance - switch between tabs and no tabs   
3. Message logging - enable/disable message logging for Receiver (sent and received), Pubsub (received) and Twitch Chat (sent and received). Useful for debugging. It remembers the state through Transmitter reloads. If you enable it, and will keep logging all messages until you disable it again.   
- Version and Message Logging are two separate uninstallable extensions.   

  
### For extension devs
jQuery library has been completely removed.   
Transmitter now automatically loads the following libraries: Bootstrap@5.0.2, Moment@2.29.1, Socket.io@2.2.0, OBS-websocket@4.0.2.   

#### Global helper functions
- there is a global function for everything you can send to LioranBoard    
- For example, to send an extension command, you can now do:    
` LBSendExtCommand('my extension name', channelid: 'real', channelname: 'string', variable: 'string')` 
- To send an extension trigger, you can now do:   
` LBTriggerExt('my extension trigger', 'some value1', 'some value2', 'some value3')`  
    
 *See all functions in the How to make extensions.txt file or directly in the Transmitter code under 'LB helper functions' comment.*

## Transmitter Collaboration

Transmitter is generated by Jekyll. Each section is a separate file generated from `_includes` folder. If you wish to propose changes, please do so by editing these files.
Any changes will immediately reflect at https://christinna9031.github.io/LioranBoard-Transmitter/. I also manually generate the Transmitter file for each release, which can be found in `_site` folder.
