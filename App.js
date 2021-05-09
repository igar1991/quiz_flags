import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
  Modal,
  Share,
  Linking,
  FlatList,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Header } from "./components/Header";
import { DATARU, DATAEN } from "./DATA";
import { CButton } from "./components/CButton";
import { THEME } from "./components/THEME";
import { Test } from "./components/Test";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { AdMobRewarded } from "expo-ads-admob";
import * as Localization from "expo-localization";
import i18n from "i18n-js";

AdMobRewarded.setAdUnitID("ca-app-pub-4957827248681224/9057411339");

const SCREEN_WIDTH = Dimensions.get("window").width;

i18n.translations = {
  en: {
    data: DATAEN,
    start: "Start",
    sharing: "Share",
    rev: "Review",
    watchreward: "View Ads",
    notlife: "You don't have enough hearts",
    back: "Back",
    revwant: "Want more levels? Review the app!",
    notwant: "I don't want",
    shartext:
      "How well do you know the flags? Download and test your strength:",
  },
  ru: {
    data: DATARU,
    start: "Начать игру",
    sharing: "Поделиться",
    rev: "Оценить",
    watchreward: "Посмотреть рекламу",
    notlife: "У тебя недостаточно сердечек",
    back: "Назад",
    revwant: "Хочешь больше уровней? Оцени приложение!",
    notwant: "Не хочу",
    shartext: "Как хорошо ты знаешь флаги? Скачивай и проверь свои силы:",
  },
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;

const DATA = i18n.t("data");

const appUrl =
  "https://play.google.com/store/apps/details?id=com.igar1991.quiz_flags";

export default function App() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("main");
  const [test, setTest] = useState(null);
  const [colorB, setColorB] = useState([
    THEME.second,
    THEME.second,
    THEME.second,
    THEME.second,
  ]);
  const [life, setLife] = useState(10);
  const [notLife, setNotLife] = useState(false);
  const [notrew, setNotrew] = useState(false);
  const [level, setLevel] = useState(2);
  const [loadAd, setLoadAd] = useState(false);

  useEffect(() => {
    fetchAdmob();
    return function cleanup() {
      AdMobRewarded.removeAllListeners();
    };
  }, [life]);

  const fetchAdmob = async () => {
    AdMobRewarded.addEventListener("rewardedVideoDidRewardUser", () => {
      console.log("Rewarded", life);
      let lv = Number(life) + 1;
      saveLife(lv);
      setLife(lv);
      setNotrew(false);
      console.log(life);
    });
    AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => {
      console.log("VideoLoaded", life);
      setLoadAd(true);
    });
    AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () =>
      console.log("FailedToLoad", life)
    );
    AdMobRewarded.addEventListener("rewardedVideoDidOpen", () =>
      console.log("Opened", life)
    );
    AdMobRewarded.addEventListener("rewardedVideoDidClose", () => {
      console.log("Closed", life);
      setLoadAd(false);
    });
    AdMobRewarded.addEventListener("rewardedVideoWillLeaveApplication", () =>
      console.log("LeaveApp", life)
    );
    AdMobRewarded.addEventListener("rewardedVideoDidStart", () =>
      console.log("Started", life)
    );
    await AdMobRewarded.requestAdAsync();
  };

  const readData = async () => {
    try {
      const userLife = await AsyncStorage.getItem("@life");
      const userLevel = await AsyncStorage.getItem("@level");

      if (userLife !== null) {
        setLife(userLife);
      }
      if (userLevel !== null) {
        setLevel(userLevel);
      }
      console.log(userLife, userLevel);
    } catch (e) {
      alert("Failed to fetch the data from storage");
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${i18n.t("shartext")} ${appUrl}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const saveLife = async (value) => {
    try {
      await AsyncStorage.setItem("@life", value.toString());
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  const saveLevel = async (value) => {
    try {
      await AsyncStorage.setItem("@level", value.toString());
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  async function uploadFont() {
    await Font.loadAsync({
      Lemon: require("./lemon.otf"),
    });
    await readData();
  }

  if (!ready) {
    return (
      <AppLoading
        startAsync={uploadFont}
        onFinish={() => setReady(true)}
        onError={console.log("warn")}
      />
    );
  }

  const backUp = () => {
    if (status == "test") {
      setStatus("menu");
      setColorB([THEME.second, THEME.second, THEME.second, THEME.second]);
    } else {
      setStatus("main");
    }
  };

  const addTest = (item) => {
    setTest(item);
    setStatus("test");
  };

  const showAds = async () => {
    if (!loadAd) {
      await AdMobRewarded.requestAdAsync();
    }
    await AdMobRewarded.showAdAsync();
  };

  const answerAdd = (i) => {
    if (life > 0) {
      if (test.ask[i] == test.truask) {
        const arr1 = colorB.map((item, index) =>
          index == i ? THEME.green : item
        );
        setColorB(arr1);
        if (test.id == level) {
          let l = Number(level) + 1;
          saveLevel(l);
          setLevel(l);
        }

        setTimeout(() => {
          if (DATA.length == test.id) {
            setStatus("menu");
            setNotrew(true);
          } else {
            setTest(DATA[test.id]);
          }

          setColorB([THEME.second, THEME.second, THEME.second, THEME.second]);
        }, 500);
      } else {
        const arr2 = colorB.map((item, index) =>
          index == i ? THEME.red : item
        );
        setColorB(arr2);
        let lo = Number(life) - 1;
        setLife(lo);
        saveLife(lo);
        console.log(life, lo);
      }
    } else {
      setNotLife(true);
    }
  };

  const handlePress = async () => {
    const supported = await Linking.canOpenURL(appUrl);

    if (supported) {
      await Linking.openURL(appUrl);
    } else {
      console.log(`Don't know how to open this URL: ${appUrl}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Quizzland" status={status} backUp={backUp} life={life} />
      {status === "main" && (
        <>
          <View style={{ flex: 6, width: "100%", backgroundColor: THEME.main }}>
            <Image
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
              source={require("./components/quizzland.png")}
            />
          </View>
          <View
            style={{
              flex: 5,
              width: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: "center",
              backgroundColor: THEME.main,
            }}
          >
            <CButton
              title={i18n.t("start")}
              onPress={() => setStatus("menu")}
              style={{
                backgroundColor: THEME.second,
                borderRadius: 5,
              }}
            />
            <CButton
              title={i18n.t("sharing")}
              onPress={onShare}
              style={{
                backgroundColor: "white",
                borderRadius: 5,
              }}
              textStyle={{ color: THEME.main }}
            />
            <CButton
              title={i18n.t("rev")}
              onPress={handlePress}
              style={{
                backgroundColor: "white",
                borderRadius: 5,
              }}
              textStyle={{ color: THEME.main }}
            />
          </View>
        </>
      )}
      {status === "menu" && (
        <>
          <View
            style={{
              flex: 11,
              width: "100%",
              backgroundColor: THEME.main,
            }}
          >
            <FlatList
              data={DATA}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: "space-around" }}
              renderItem={({ item }) => (
                <Test
                  key={item.id}
                  title={item.id}
                  onPress={() =>
                    level >= item.id ? addTest(item) : console.log("no")
                  }
                  lock={level >= Number(item.id) ? false : true}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </>
      )}
      {status === "test" && (
        <>
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Lemon",
                alignContent: "center",
              }}
            >
              {test.id}/{DATA.length}
            </Text>
          </View>
          <View style={{ flex: 4, width: "100%", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", fontSize: SCREEN_WIDTH / 3 }}>
              {test.quest}
            </Text>
          </View>
          <View
            style={{
              flex: 5,
              width: "100%",
              justifyContent: "center",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <CButton
              title={test.ask[0]}
              onPress={() => answerAdd(0)}
              style={{ backgroundColor: colorB[0] }}
            />
            <CButton
              title={test.ask[1]}
              onPress={() => answerAdd(1)}
              style={{ backgroundColor: colorB[1] }}
            />
            <CButton
              title={test.ask[2]}
              onPress={() => answerAdd(2)}
              style={{ backgroundColor: colorB[2] }}
            />
            <CButton
              title={test.ask[3]}
              onPress={() => answerAdd(3)}
              style={{ backgroundColor: colorB[3] }}
            />
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: "center",
            }}
          >
            <CButton
              title={i18n.t("watchreward")}
              onPress={showAds}
              icon={true}
              style={{ backgroundColor: THEME.main, borderRadius: 5 }}
            />
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notLife}
        onRequestClose={() => {
          setModalVisible(!notLife);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {i18n.t("notlife")}{" "}
              {<FontAwesome5 name="sad-cry" size={25} color={THEME.main} />}
            </Text>

            <CButton
              title={i18n.t("watchreward")}
              onPress={showAds}
              style={{
                backgroundColor: THEME.main,
                borderRadius: 5,
              }}
              textStyle={{ fontSize: 14 }}
              icon={true}
            />
            <CButton
              title={i18n.t("back")}
              onPress={() => setNotLife(!notLife)}
              style={{
                backgroundColor: THEME.second,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={notrew}
        onRequestClose={() => {
          setModalVisible(!notrew);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {i18n.t("revwant")}{" "}
              {<AntDesign name="star" size={25} color={THEME.second} />}
            </Text>

            <CButton
              title={i18n.t("rev")}
              style={{
                backgroundColor: THEME.second,
                borderRadius: 5,
              }}
              onPress={handlePress}
            />
            <CButton
              title={i18n.t("notwant")}
              onPress={() => setNotrew(!notrew)}
              style={{
                backgroundColor: "#C9193B",
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Lemon",
    color: THEME.main,
  },
});
