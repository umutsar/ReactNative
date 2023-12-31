
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, Button,
    FlatList, Dimensions, TouchableOpacity,
    Image, Modal, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// ******************** SQLİTE ************************


// ****************** SQLİTE END **********************


const { width, height } = Dimensions.get('window');


export default function ChatScreen() {


    const [socketConnected, setSocketConnected] = useState(false);
    const [textInputElements, setTextInputElements] = useState(["Element 1sadfas", "Element 2sf", "Element 3"]);
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const socket = new WebSocket('ws://31.210.43.49:1122');

    useEffect(() => {
        socket.addEventListener('open', () => {
            console.log('Connected to WebSocket server');
            setSocketConnected(true);
        });

        socket.addEventListener('message', (event) => {
            // Assuming you have a state variable named output to store messages
            // setOutput(`Server says: ${event.data}`);
        });

        socket.addEventListener('close', () => {
            console.log('Connection closed');
            setSocketConnected(false);
        });

        return () => {
            socket.close();
        };
    }, []); // Empty dependency array ensures this effect runs once when the component mounts

    const gonder = () => {
        if (socketConnected) {
            if (message != "") {

                socket.send(message);
                setTextInputElements([...textInputElements, message]);
                setMessage('');
            }

        }
    };

    const openAttachmentMenu = () => {
        setModalVisible(true);
    };

    const closeAttachmentMenu = () => {
        setModalVisible(false);
    };

    const handlePhotoSelection = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please enable camera roll permissions to pick an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const photoMessage = { type: 'photo', assets: result.assets };
            sendMessage(photoMessage);
        }

        closeAttachmentMenu();
    };

    const sendMessage = (newMessage) => {
        if (socketConnected) {
            socket.send(JSON.stringify(newMessage));

            // Update the state based on the type of message
            if (newMessage.type === 'photo' && newMessage.assets.length > 0) {
                const photoUri = newMessage.assets[0].uri;
                setTextInputElements([...textInputElements, { type: 'photo', uri: photoUri }]);
            } else {
                setTextInputElements([...textInputElements, newMessage]);
            }

            setMessage('');
        }
    };

    const closeModalOnOutsideClick = () => {
        closeAttachmentMenu();
    };

    return (
        <View style={styles.container}>
            <View style={styles.sahteKutuUst}></View>
            <View style={styles.profilePhotoParent}>
                <Image source={require('../../assets/icon.png')} style={styles.profilePhoto} />
                <Text style={styles.profileName}>Kullanıcı </Text>
            </View>
            <View style={styles.parentFlatlist}>

                <FlatList style={styles.FlatListMessages}
                    data={textInputElements}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        // Check the type of the item and render accordingly
                        item.type === 'photo' ?
                            (<Image source={{ uri: item.uri }} style={styles.selectedImage} />) :
                            (<Text

                                style={[styles.herBirText]}>
                                {item}
                            </Text>)
                    )}
                />

            </View>

            <View style={styles.inputVeButton}>
                <TouchableOpacity
                    style={styles.attachmentButton}
                    onPress={openAttachmentMenu}
                >
                    {selectedImage ? (
                        <Image source={{ assets: selectedImage }} style={styles.selectedImage} />
                    ) : (
                        <Image source={require('../../assets/icon.png')} style={styles.attachmentIcon} />
                    )}
                </TouchableOpacity>
                <TextInput
                    style={styles.inputElementi}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    multiline={true}
                    numberOfLines={3}
                />
                <TouchableOpacity
                    style={socketConnected && message !== "" ? styles.gonderButonu : styles.gonderButonuDisabled}
                    onPress={gonder}
                    disabled={!socketConnected || message === ""}
                >
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>

            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeAttachmentMenu}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={closeModalOnOutsideClick}
                >
                    <View style={styles.attachmentMenu}>
                        <TouchableOpacity onPress={handlePhotoSelection}>
                            <Text>Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeAttachmentMenu}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },


    sahteKutuUst: {
        height: height * 0.04,
        width: width,
    },



    profilePhotoParent: {
        borderRadius: 20,
        backgroundColor: 'gray',
        width: width * 0.98,
        flexDirection: 'row',
        alignItems: 'center',      // Dikeyde ortalama için
        height: height * 0.06,
    },

    profilePhoto: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },

    profileName: {
        fontSize: 20,
        marginLeft: width * 0.1
    },

    parentFlatlist: {
        backgroundColor: 'yellow',
        borderRadius: 20,
        flex: 1,
        width: width * 0.98,
    },

    FlatListMessages: {
        padding: 10
    },

    herBirText: {
        marginTop: 6,
        borderWidth: 2, // Kalınlık
        borderColor: 'black', // Renk
        borderRadius: 10,
        padding: height * 0.01,
        alignSelf: 'flex-start', // İçeriği sola yasla
    },


    inputVeButton: {
        width: width * 0.98,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: height * 0.07,
        backgroundColor: 'blue',
        borderRadius: 16
    },


    inputElementi: {
        padding: 10,
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 10,
        width: width * 0.6,
    },


    gonderButonu: {
        backgroundColor: '#4CAF50',
        width: width * 0.2,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },


    gonderButonuDisabled: {
        backgroundColor: '#598c3b', // veya başka bir renk
        width: width * 0.2,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },


    attachmentButton: {
        padding: 10,
    },


    attachmentIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },


    selectedImage: {
        aspectRatio: 1, // Oranı koru, oran 1:1 olacak şekilde ayarlandı
        width: width * 0.92,
        marginTop: 6,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        padding: height * 0.01,
    },


    attachmentMenu: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 10,
        position: 'absolute',
        bottom: 40,
        left: 20,
    },


    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
