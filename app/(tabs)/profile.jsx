import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Share,
  Alert,
} from "react-native";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "@/configs/FirebaseConfig";
import { useRouter } from "expo-router";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation(); // اضافه کردن ناوبری
  const screenWidth = Dimensions.get("window").width;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/mytrip');// ریدایرکت به صفحه MyTrip
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName });
        await updateEmail(user, email);
        alert("Profile updated successfully!");
        setIsModalVisible(false);
      } catch (error) {
        alert("Error updating profile: " + error.message);
      }
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: "Check out this awesome app! [App Link]",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: " + result.activityType);
        } else {
          console.log("Shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const getInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <ImageBackground
        style={styles.headerBackground}
        source={require("@/assets/images/headProfile.jpg")}
      >
        <View style={[styles.profileContainer, { top: screenWidth / 3.5 }]}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>{getInitial()}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
      <View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            fontFamily: "Outfit-Bold",
            fontSize: 25,
          }}
        >
          {user?.displayName}
        </Text>
      </View>

      {/* آیتم‌های پایینی */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <Text style={styles.actionText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare} // اشتراک گذاری لینک
        >
          <Text style={styles.actionText}>Share App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=> router.push('/mytrip')}>
          <Text style={styles.actionText}>My Trips</Text>
        </TouchableOpacity>
      </View>

      {/* مودال ویرایش پروفایل */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View>
        <Text style={{
          fontFamily:"Outfit-Medium",
          fontSize:15,
          color:"#888",
          textAlign:"center",
          marginTop:45
        }}>Developed by Maitham Alizadeh</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 35,
    padding: 25,
  },
  headerBackground: {
    width: "100%",
    height: 190,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  profileContainer: {
    position: "absolute",
    alignSelf: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  placeholderContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6c5ce7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "Outfit-Bold",
  },
  actionsContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#6c5ce7",
    padding: 15,
    borderRadius: 8,
    margin: 5,
    width: "45%",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Outfit-Bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Outfit-Bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#6c5ce7",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  cancelButtonText: {
    color: "#000",
    textAlign: "center",
  },
});

export default Profile;
