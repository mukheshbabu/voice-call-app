import React, { useEffect, useState } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function App() {
  const [userInfo, setUserInfo] = useState({ userName: "", userId: "" });
  const [calleeId, setCalleeId] = useState("");
  const [zegoInstance, setZegoInstance] = useState(null);

  useEffect(() => {
    init();
    initZego();
  }, []);

  function init() {
    const userId = randomID();
    const userName = "user_" + userId;
    setUserInfo({ userName, userId: userId });
  }

  async function initZego() {
    try {
      const appID = parseInt(import.meta.env.VITE_APP_ID);
      const serverSecret = import.meta.env.VITE_SERVER_SECRET;
      const roomID = "testRoom";

      if (!appID || !serverSecret) {
        console.error(
          "Missing APP_ID or SERVER_SECRET in environment variables"
        );
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(),
        "initialUser"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      await zp.addPlugins({ ZIM });
      setZegoInstance(zp);
    } catch (error) {
      console.error("Failed to initialize Zego:", error);
    }
  }

  async function handleCall(callType) {
    if (!zegoInstance) {
      alert("Video chat system is not initialized yet. Please try again.");
      return;
    }

    if (!calleeId.trim()) {
      alert("Please enter a valid callee ID");
      return;
    }

    try {
      const appID = parseInt(import.meta.env.VITE_APP_ID);
      const serverSecret = import.meta.env.VITE_SERVER_SECRET;
      const roomID = "testRoom";

      // Generate a new token with current user info
      const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userInfo.userId,
        userInfo.userName
      );

      const result = await zegoInstance.sendCallInvitation({
        callees: [{ userID: calleeId, userName: `user_${calleeId}` }],
        callType: callType,
        timeout: 60,
      });

      if (result.errorInvitees && result.errorInvitees.length) {
        alert("The user does not exist or is offline");
      }
    } catch (error) {
      console.error("Call failed:", error);
      alert("Failed to make call. Please check console for details.");
    }
  }

  return (
    <div className="container">
      <div className="title">
        <h2>Username: {userInfo.userName}</h2>
        <h2>UserId: {userInfo.userId}</h2>
      </div>
      <div className="input-field">
        <input
          type="text"
          placeholder="callee's userID"
          spellCheck="false"
          onChange={(e) => setCalleeId(e.target.value)}
        />
        <label>Enter Callee's UserID</label>
      </div>
      <div className="btns">
        <button
          onClick={() => handleCall(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}
        >
          Voice Call
        </button>
        <button
          onClick={() => handleCall(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}
        >
          Video Call
        </button>
      </div>
    </div>
  );
}

export default App;
