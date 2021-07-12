//[Get Version hook]
case 'LBVersionHook':
    if (typeof window.LBVersion === 'undefined') window.LBVersion = {};
    window.LBVersion[LioranBoardJSON.variable] = LioranBoardJSON.value;
    if (Object.values(window.LBVersion).length === 3) LBProcessVersion(window.LBVersion);
    break;
//[Get Version hook end]