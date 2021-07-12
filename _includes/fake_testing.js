// fake subscriber testing
function fakesub() {
  let i_str;
  let i_name = fakename();
  if (i_force != '') { i_name = i_force; }
  const i_name2 = fakename(i_name);
  const i_value = (itier2.checked) ? 2000 : (itier3.checked) ? 3000 : (iprime.checked) ? 'Prime' : 1000;
  const i_context = (isubgift.checked) ? 'subgift' : (ianongift.checked) ? 'anonsubgift' : 'resub';
  const messages = ['Hello world!', "Love your stream, you are a very genuine guy and you're not affraid to say it how it is. But, I would just prefer if you didn't give your opinion, just saying.", 'Supporting how I can, keep up the great work.', 'All that glitters is not gold. Fair is foul, and foul is fair Hover through the fog and filthy air. These violent delights have violent ends. Hell is empty and all the devils are here. By the pricking of my thumbs, Something wicked this way comes. Open, locks, Whoever knocks!'];
  const i_message = nsubmessage.value || messages[Math.floor(Math.random() * messages.length)];
  const months = nsubmonths.value || Math.ceil(Math.random() * 10);
  const context = (months > 1) ? 'resub' : 'sub';
  if (i_context === 'resub') { i_str = `{"type": "MESSAGE","data": {"topic": "channel-subscribe-events-v1.44322889","message": "{\\"user_name\\": \\"${i_name.toLowerCase()}\\",\\"display_name\\": \\"${i_name}\\",\\"channel_name\\": \\"twitch\\",\\"user_id\\": \\"44322889\\",\\"channel_id\\": \\"12826\\",\\"time\\": \\"2015-12-19T16:39:57-08:00\\",\\"sub_plan\\": \\"${i_value}\\",\\"sub_plan_name\\": \\"Channel Subscription (mr_woodchuck)\\",\\"cumulative_months\\": ${months},\\"streak_months\\": 1,\\"context\\": \\"${context}\\",\\"sub_message\\": {\\"message\\": \\"${i_message}\\",\\"emotes\\": [{\\"start\\": 23,\\"end\\": 7,\\"id\\": 2867}]}}"}}`; }
  if (i_context === 'subgift') { i_str = `{"type": "MESSAGE","data": {"topic": "channel-subscribe-events-v1.44322889","message": "{\\"user_name\\": \\"${i_name.toLowerCase()}\\",\\"display_name\\": \\"${i_name}\\",\\"channel_name\\": \\"twitch\\",\\"user_id\\": \\"44322889\\",\\"channel_id\\": \\"12826\\",\\"time\\": \\"2015-12-19T16:39:57-08:00\\",\\"sub_plan\\": \\"${i_value}\\",\\"sub_plan_name\\": \\"Channel Subscription (mr_woodchuck)\\",\\"months\\": ${months},\\"context\\": \\"subgift\\",\\"sub_message\\": {\\"message\\": \\"${i_message}\\",\\"emotes\\": null },\\"recipient_id\\": \\"13405587\\",\\"recipient_user_name\\": \\"${i_name2.toLowerCase()}\\",\\"recipient_display_name\\": \\"${i_name2}\\"}}"}}`; }
  if (i_context === 'anonsubgift') { i_str = `{"type": "MESSAGE","data": {"topic": "channel-subscribe-events-v1.44322889","message": "{\\"channel_name\\": \\"twitch\\",\\"channel_id\\": \\"12826\\",\\"time\\": \\"2015-12-19T16:39:57-08:00\\",\\"sub_plan\\": \\"${i_value}\\",\\"sub_plan_name\\": \\"Channel Subscription (mr_woodchuck)\\",\\"months\\": ${months},\\"context\\": \\"anonsubgift\\",\\"sub_message\\": {\\"message\\": \\"${i_message}\\",\\"emotes\\": null },\\"recipient_id\\": \\"13405587\\",\\"recipient_user_name\\": \\"${i_name2.toLowerCase()}\\",\\"recipient_display_name\\": \\"${i_name2}\\"}"}}`; }
  console.log('Fake Test Sub sent.'); lioranboardclient.send(i_str);
}

function fakesub2() {
  if (i_force == '') { fakesub(); }
}

// fake gift sub testing
function fakegiftamount() {
  if (i_force !== '') { return 0; }
  i_force = fakename();
  if (igiftamount.value < 1) { igiftamount.value = 1; }
  if (igiftamount.value > 100) { igiftamount.value = 100; }
  if (iprime.checked == true) { iprime.checked = false; itier1.checked = true; }
  if (ianongift.checked == false) { isubgift.checked = true; } else { i_force = 'Anonymous User'; }
  let i_value = 'Tier 1'; if (itier2.checked == true) { i_value = 'Tier 2'; } if (itier3.checked == true) { i_value = 'Tier 3'; }
  console.log(`Fake sub gift amount of ${igiftamount.value} sent.`); lioranboardclient.send(`{"type":"MESSAGE","topic":"FakeNotification","fake":0,"amount":"${igiftamount.value}","name":"${i_force}","tier":"${i_value}"}`);
  for (let ii = 0; ii < igiftamount.value; ii++) {
    setTimeout(fakesub, 1000 + ii * 10);
  }
  setTimeout(forcenameoff, 2100);
}

// check/uncheck boxes if sub is anon, prime etc.
function CheckUncheckSubGift(e) {
  iprime.checked = !((e.id === 'isubgift' || e.id === 'ianongift'));
  itier1.checked = !!((e.id === 'isubgift' || e.id === 'ianongift'));
  ianongift.checked = !((e.id === 'iprime' || e.id === 'isubgift'));
  isubgift.checked = !((e.id === 'iprime' || e.id === 'ianongift'));
}

function forcenameoff() {
  i_force = '';
}

// fake bits testing
function fakebits() {
  const i_name = fakename();
  ibitsamount.value = (ibitsamount.value < 1) ? 1 : ibitsamount.value;
  const message = ibitsmessage.value.replace(/"/g, "'") || 'Enjoy the non-existant bits, Even if, only for a short time you got the dopamine of seeing a bits notification. Have a good day.';
  const total = ibitstotal.value || Math.ceil(Math.random() * 5000);
  i_value = parseFloat(ibitsamount.value); if (isNaN(i_value) == true) i_value = 1; if (i_value <= 0) i_value = 1;
  i_str = `{"type": "MESSAGE","data": {"topic": "channel-bits-events-v2.46024993","message": "{\\"data\\":{\\"user_name\\":\\"${i_name.toLowerCase()}\\",\\"channel_name\\":\\"twitch\\",\\"user_id\\":\\"95546976\\",\\"channel_id\\":\\"46024993\\",\\"time\\":\\"2017-02-09T13:23:58.168Z\\",\\"chat_message\\":\\"${message}\\",\\"bits_used\\":${i_value},\\"total_bits_used\\":${total},\\"context\\":\\"cheer\\",\\"badge_entitlement\\":{\\"new_version\\":25000,\\"previous_version\\":10000}},\\"version\\":\\"1.0\\",\\"message_type\\":\\"bits_event\\",\\"message_id\\":\\"8145728a4-35f0-4cf7-9dc0-f2ef24de1eb6\\",\\"is_anonymous\\":true}"}}`;
  console.log(`Fake Test bits for ${i_value}`); lioranboardclient.send(i_str);
}

// fake channel points testing
function fakepoints() {
  const i_name = fakename();
  const message = nchannelpointsmsg.value.replace(/"/g, "'") || 'Testing Message';
  i_str = `{"type":"MESSAGE","data":{"topic":"channel-points-channel-v1.23071698","message":"{\\"type\\":\\"reward-redeemed\\",\\"data\\":{\\"timestamp\\":\\"2020-05-10T02:42:01.699693419Z\\",\\"redemption\\":{\\"id\\":\\"f2418f14-1e2b-41f3-90e5-fcad7ab2c701\\",\\"user\\":{\\"id\\":\\"23071698\\",\\"login\\":\\"${i_name.toLowerCase()}\\",\\"display_name\\":\\"${i_name}\\"},\\"channel_id\\":\\"23071698\\",\\"redeemed_at\\":\\"2020-05-10T02:42:01.674616194Z\\",\\"reward\\":{\\"id\\":\\"46b39721-ce2b-4670-8b2d-b520762a3f1e\\",\\"channel_id\\":\\"23071698\\",\\"title\\":\\"${ichannelpoints.value}\\",\\"prompt\\":\\"Testing Message\\",\\"cost\\":1,\\"is_user_input_required\\":${nchannelpointinput.checked},\\"is_sub_only\\":false,\\"image\\":{\\"url_1x\\":\\"https://static-cdn.jtvnw.net/custom-reward-images/23071698/46b39721-ce2b-4670-8b2d-b520762a3f1e/d50acf1d-4a0c-4dd0-8596-e5ca0c386332/custom-1.png\\",\\"url_2x\\":\\"https://static-cdn.jtvnw.net/custom-reward-images/23071698/46b39721-ce2b-4670-8b2d-b520762a3f1e/d50acf1d-4a0c-4dd0-8596-e5ca0c386332/custom-2.png\\",\\"url_4x\\":\\"https://static-cdn.jtvnw.net/custom-reward-images/23071698/46b39721-ce2b-4670-8b2d-b520762a3f1e/d50acf1d-4a0c-4dd0-8596-e5ca0c386332/custom-4.png\\"},\\"default_image\\":{\\"url_1x\\":\\"https://static-cdn.jtvnw.net/custom-reward-images/default-1.png\\",\\"url_2x\\":\\"https://static-cdn.jtvnw.net/custom-reward-images/default-2.png\\",\\"url_4x\\":\\"https://static-cdn.jtvnw.net/custom-reward-images/default-4.png\\"},\\"background_color\\":\\"#00C7AC\\",\\"is_enabled\\":true,\\"is_paused\\":false,\\"is_in_stock\\":true,\\"max_per_stream\\":{\\"is_enabled\\":false,\\"max_per_stream\\":100},\\"should_redemptions_skip_request_queue\\":true,\\"template_id\\":null,\\"updated_for_indicator_at\\":\\"2020-02-12T18:00:03.401562134Z\\"},\\"user_input\\":\\"${message}\\",\\"status\\":\\"FULFILLED\\"}}}"}}`;
  console.log(`Fake Test Channel Points Redeem "${ichannelpoints.value}" sent.`); lioranboardclient.send(i_str);
}

// fake raid and host testing
function fakeraid() { if (iraidamount.value < 1) { iraidamount.value = 1; } console.log(`Fake Raid of ${iraidamount.value} sent.`); lioranboardclient.send(`{"type":"MESSAGE","topic":"FakeNotification","fake":1,"amount":"${iraidamount.value}","name":"${fakename()}"}`); }
function fakehost() { if (ihostamount.value < 1) { ihostamount.value = 1; } console.log(`Fake Host of ${ihostamount.value} sent.`); lioranboardclient.send(`{"type":"MESSAGE","topic":"FakeNotification","fake":2,"amount":"${ihostamount.value}","name":"${fakename()}"}`); }

// fake chat message testing
function fakechatmsg() {
  const name = ichatname.value || fakename();
  const msg = ichatmsg.value.replace(/"/g, "'") || 'This is a test message.';
  const badge = [];
  const user_id = "123456789"
  if (ichatbroadcaster.checked) { badge.push('broadcaster/1'); }
  if (ichatmod.checked) { badge.push('moderator/1'); }
  if (ichatvip.checked) { badge.push('vip/1'); }
  if (ichatsub.checked) {
    const tier = parseInt(chatmsgsubtier.value);
    let month = (chatmsgsubmonth.value != 1) ? parseInt(chatmsgsubmonth.value) : 0;
    month = (month > 3 && month < 6) ? month = 3 : (month > 6 && month < 9) ? month = 6 : (month > 9 && month < 12) ? month = 9 : month
    const subBadge = (tier === 1) ? `subscriber/${month}` : (tier === 2) ? `subscriber/${2000 + month}` : `subscriber/${3000 + month}`;
    badge.push(subBadge);
  }
  const chat_obj = {
    emotes: "304822798:0-9/304682444:11-19",
    login: name.toLowerCase(),
    display_name: name,
    user_id,
    color: "#189A8D",
    badge: badge.join(),
    message: msg,
    channel: name,
    topic: 'chatmessage',
    type: 'MESSAGE',
  };
  lioranboardclient.send(JSON.stringify(chat_obj));
}

// fake names for testing
function fakename(name = 'none') {
  const names = ['Lioran', 'nutella4eva', 'Kottpower', 'Neverwho', 'Deomew', 'Doodybeard', 'Exeldro', 'AuralMoral', 'SuperMetroid', 'Melonax', 'Ptoil', 'LinksDarkHalf', 'Derpiii_', 'CoD360_420', 'Bill', 'Kurocha', 'Lisa', 'DeathByButtonMash', 'Daryl', 'Sebas', 'Ramsreef', 'Kelvin214'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  if (name !== randomName) return randomName;
  return fakename(name);
}