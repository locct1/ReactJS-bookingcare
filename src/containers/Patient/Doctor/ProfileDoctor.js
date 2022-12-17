import React, { Component } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import localization from "moment/locale/vi";
import { FormattedMessage } from "react-intl";
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        };
    }
    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        });
    }
    getInfoDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(this.props.doctorId);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
        if (this.props.doctorId !== prevProps.doctorId) {
        }

    }
    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY') :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return (
                <>
                    <div>
                        {time} - {date}
                    </div>
                    <div>
                        Miễn phí đặt lịch
                    </div>
                </>
            )

        }
    }


    render() {
        let { dataProfile } = this.state;
        let { language,isShowDescriptionDoctor,dataTime } = this.props;
        console.log(dataProfile);
        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi},${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn},${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left"
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >

                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className="down">
                            {
                                isShowDescriptionDoctor===true?
                                <>
                            {
                                dataProfile && dataProfile.Markdown && dataProfile.Markdown.description
                                && <span>
                                    {dataProfile.Markdown.description}
                                </span>
                            }
                                </>
                                :<>
                                {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="price">
                    Giá khám:
                    {
                        dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.VI
                        &&
                        <NumberFormat
                            class="currency"
                            value={dataProfile.Doctor_Info.priceTypeData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                        />
                    }
                    {
                        dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.EN
                        &&
                        <NumberFormat
                            class="currency"
                            value={dataProfile.Doctor_Info.priceTypeData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'$'}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
