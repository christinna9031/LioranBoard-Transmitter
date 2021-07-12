//[Get Version script]
function LBGetVersion() {
  LBGetValue('obs_websocket_version', 'LBVersionHook');
  LBGetValue('obs_studio_version', 'LBVersionHook');
  LBGetValue('lioranboard_version', 'LBVersionHook');
}

async function LBProcessVersion(obj) {
  let receiver = obj.lioranboard_version;
  const obs = obj.obs_studio_version;
  const obsws = obj.obs_websocket_version;
  let version = JSON.parse(localStorage.getItem('LBversion'));
  const versionDate = localStorage.getItem('LBversionDate');
  if (receiver == 0) receiver = '';
  if (!version || (Date.now() - versionDate > 86000000)) await fetchVersion();
  else compareVersion(version);

  // fetch the latest version from a database
  async function fetchVersion() {
    await fetch('https://6py9buvgh1.execute-api.us-west-2.amazonaws.com/main/device/version')
      .then((response) => response.json())
      .then((data) => {
        version = {};
        data.Items.forEach((element) => {
          version[element.id.S] = element.version.S;
        });
        compareVersion(version);
        localStorage.setItem('LBversion', JSON.stringify(version));
        localStorage.setItem('LBversionDate', Date.now());
      })
      .catch((e) => console.log(e));
  }

  // compare current and latest versions
  function compareVersion(v) {
    const versionOK = '<span class="connected">OK</span>';
    const versionNA = '<span style="color:#E4B314">N/A</span';
    const tsl = document.firstChild.nextSibling.nodeValue.replace(/[^\d.-]/g, '');
    const statusOBS = (num(v.obs) > num(obs)) ? '<a href="https://obsproject.com/download" target="_blank">Update</a>' : versionOK;
    const statusOBSWS = (num(v.obsws) > num(obsws)) ? '<a href="https://github.com/Palakis/obs-websocket/releases" target="_blank">Update</a>' : versionOK;
    const statusReceiver = (num(v.receiver) > num(receiver)) ? '<a href="http://lioran.servehttp.com/share/lioranboard/download.html" target="_blank">Update</a>' : versionOK;
    const statusTSL = (num(v.transmitter) > num(tsl)) ? '<a href="http://lioran.servehttp.com/share/lioranboard/download.html" target="_blank">Update</a>' : versionOK;

    // create object of all versions
    const versionObj = {
      obs_latestV: v.obs || 'N/A', obsws_latestV: v.obsws || 'N/A', receiver_latestV: v.receiver || 'N/A', streamdeck_latestV: v.streamdeck || 'N/A', transmitter_latestV: v.transmitter || 'N/A', obs_currentV: obs || 'N/A', obsws_currentV: obsws || 'N/A', receiver_currentV: receiver || 'N/A', streamdeck_currentV: 'N/A', transmitter_currentV: tsl || 'N/A', obs_status: (obs && v.obs) ? statusOBS : versionNA, obsws_status: (obsws && v.obsws) ? statusOBSWS : versionNA, receiver_status: (receiver && v.receiver) ? statusReceiver : versionNA, streamdeck_status: versionNA, transmitter_status: (tsl && v.transmitter) ? statusTSL : versionNA,
    };

    fillValues(versionObj);

    // fill version values into table
    function fillValues(verObj) {
      Object.keys(verObj).forEach((key) => {
        document.getElementById(key).innerHTML = verObj[key];
      });
    }
  }

  // convert letters to numbers in versions to easily compare them
  function num(str) {
    if (str.search(/[a-zA-Z]/) != -1) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      let letter = str.slice(str.search(/[a-zA-Z]/));
      str = str.slice(0, str.search(/[a-zA-Z]/));
      letter = letter.replace(letter, alphabet.indexOf(letter) + 1);
      str += letter;
    } else { str += 0; }
    str = str.replace(/\./g, '');
    return str;
  }
}
//[Get Version script end]