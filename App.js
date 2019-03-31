import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default class PedometerSensor extends React.Component {
    state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
    stepDiff: 0,
    lastUpdate: new Date(),
    currentUpdate: 0.0,
    bpm: 0.0,
    bpmList: []
    };
    
    componentDidMount() {
        this._subscribe();
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }
    
    _subscribe = () => {
        this._subscription = Pedometer.watchStepCount(result => {
                                                      this.setState({
                                                                    currentStepCount: result.steps
                                                                    });
                                                      });
        
        Pedometer.isAvailableAsync().then(
                                          result => {
                                          this.setState({
                                                        isPedometerAvailable: String(result)
                                                        });
                                          },
                                          error => {
                                          this.setState({
                                                        isPedometerAvailable: "Could not get isPedometerAvailable: " + error
                                                        });
                                          }
                                          );
    };
    
    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };
    
    timeDiff(newDate) {
        // returns time difference in seconds
        return (newDate.getTime() - this.state.lastUpdate.getTime())/1000;
    }
    
    // calculates the raw bpm
    calculateBPM(steps, timeSec) {
        return steps / (timeSec/60);
    }
    
    doubleTimeBPM(bpm){
        return bpm * 2;
    }
    
    addBpmToList(bpmVal) {
        if(this.state.bpmList.length <= 0)
            this.setState({ bpmList: [bpmVal]});
        else{
            var newArr = this.state.bpmList.slice();
            newArr.push(bpmVal);
            this.setState({ bpmList: newArr });
        }
    }
    
    refreshCurrentCount = () => {
        var newDate = new Date();
        var newCount = this.state.currentStepCount;
        var diffTime = this.timeDiff(newDate);
        var diffStep = newCount - this.state.pastStepCount;
        var BPM = this.calculateBPM(diffStep, diffTime);
        
        this.setState((state) => {
                      return {
                      currentUpdate: diffTime,
                      lastUpdate: newDate,
                      stepDiff: diffStep,
                      pastStepCount: newCount,
                      bpm: BPM
                      }
                      });
        
        this.addBpmToList(BPM);
    }
    
    showBPM = () => {
        Alert.alert(JSON.stringify(this.state.bpmList));
    }
    
    render() {
        //var bpmList = [];
        return (
                <View style={styles.container}>
                    <Text>
                    Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
                    </Text>
                    <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
                    <Button
                        title = "Press here to refresh step counter"
                        onPress = {this.refreshCurrentCount}
                    />
                    <Text>Last pressed: {this.state.lastUpdate.toString()}</Text>
                    <Text>Time between last button press and current button press: {this.state.currentUpdate.toString()}</Text>
                    <Text>Steps between: {this.state.stepDiff}</Text>
                    <Text>BPM = {this.state.bpm}</Text>
                    <Button
                        title = "press to see previous BPMs"
                        onPress = { this.showBPM }
                    />
                    </View>
                );
    }
}

const styles = StyleSheet.create({
                                 container: {
                                 flex: 1,
                                 marginTop: 15,
                                 alignItems: "center",
                                 justifyContent: "center"
                                 }
                                 });
