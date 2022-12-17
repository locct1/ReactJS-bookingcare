import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from '../../../store/actions';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { getDetailInfoDoctor } from '../../../services/userService';
import Select from 'react-select';



const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // save to Markdown table
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedOption: '',
            listDoctors: [],
            hasOldData: false,

            // save to doctor_info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: '',
            selectedPayment: '',
            selectProvince: '',
            nameClinic: '',
            addressClinic: '',
            note: '',

        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfo();
    }
    // console.log(response);
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfo;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfo;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({ contentHTML: html, contentMarkdown: text });

    }
    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectProvince: this.state.selectProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note
        });
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listProvince, listPrice } = this.state;
        let res = await getDetailInfoDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let Markdown = res.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', selectedPayment = '',
                selectedPrice = '', selectProvince = '';
            if (res.data.Doctor_Info) {
                addressClinic = res.data.Doctor_Info.addressClinic;
                nameClinic = res.data.Doctor_Info.nameClinic;
                note = res.data.Doctor_Info.note;
                paymentId = res.data.Doctor_Info.paymentId;
                priceId = res.data.Doctor_Info.priceId;
                provinceId = res.data.Doctor_Info.provinceId;
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                });
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                });
                selectProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                });
            }

            this.setState({
                contentHTML: Markdown.contentHTML,
                contentMarkdown: Markdown.contentMarkdown,
                description: Markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectProvince: selectProvince,
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
            })
        }
    };
    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        });
    }
    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        });
    }
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "USERS") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                });
            }
            if (type === "PRICE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
        }
        return result;
    }
    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.select-doctor" />

                        </label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className="content-right">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.intro" />
                        </label>
                        <textarea className="form-control" rows="4"
                            onChange={(event) => { this.handleOnChangeText(event, 'description') }}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className="more-info-extra row">
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select
                            value={this.state.selectProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                            name="selectProvince"

                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                        <input
                            onChange={(event) => { this.handleOnChangeText(event, 'nameClinic') }}
                            value={this.state.nameClinic}
                            className="form-control" />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                        <input
                            onChange={(event) => { this.handleOnChangeText(event, 'addressClinic') }}
                            value={this.state.addressClinic}
                            className="form-control" />

                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input
                            onChange={(event) => { this.handleOnChangeText(event, 'note') }}
                            value={this.state.note}
                            className="form-control" />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    onClick={() => { this.handleSaveContentMarkdown() }}
                    className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}>

                    {hasOldData === true ?
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save" />

                        </span> :
                        <span>
                            <FormattedMessage id="admin.manage-doctor.add" />
                        </span>}

                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getAllRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
