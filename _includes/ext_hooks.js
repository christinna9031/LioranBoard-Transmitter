function LBExtensionReceived() {
  switch (LioranBoardJSON.datatype) {
    // datatype you specified.
    default:
      if (requestKeys.has(LioranBoardJSON.datatype)) {
        removeKey(LioranBoardJSON.datatype);
      } else {
        console.log(LioranBoardJSON, `Warning: Hook is missing. Extension ${LioranBoardJSON.datatype} seems to not be correctly installed.`);
      };
      break;
{% include ext_hooks/get_version.js %}
{% include ext_hooks/message_logging.js %}
{% include ext_hooks/change_stream.js %}
{% include ext_hooks/viewer_count.js %}
{% include ext_hooks/sub_count.js %}
{% include ext_hooks/channel_id.js %}
{% include ext_hooks/follower_alert.js %}
{% include ext_hooks/bits_leaderboard.js %}
{% include ext_hooks/profile_picture.js %}
//You hooks will be inserted here
/*INSERT PART 3*/
   }
}
