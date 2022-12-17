import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import './UserRedux.scss';
import TableManageUser from './TableManageUser';
class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
            action: '',
            userEditId: '',

        }
    }


    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // this.props.getGenderStart();->adminActions->adminReducer(switchcase)
        // this.props.dispatch(action.fetchGenderStart());



        // try {
        //     let res = await getAllCodeService('gender');
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         });
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })

        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                previewImgURL: '',
                action: CRUD_ACTIONS.CREATE,
                userEditId: '',
            })
        }
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        let { action } = this.state;
        // fire redux action
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            })
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar:this.state.avatar
            })
        }
        // console.log(this.state);

    }
    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber',
            'address'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })

    }
    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64=new Buffer(user.image,'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: '',
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id
        })
    }
    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let { email, password, firstName, lastName, phoneNumber,
            address, gender, position, role, avatar } = this.state;
        
        return (
            <div className="user-redux-container">
                <div className="title">
                    Learn Redux User Redux hoi dan it
                </div>
                <div>
                    {isGetGenders === true ? 'Loading genders' : ''}
                </div>
                <div className="user-redux-body" >
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <button className="btn btn-primary"><FormattedMessage id="manage-user.add" /></button>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    value={email}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    className="form-control" type="email" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    value={password}
                                    onChange={(event) => { this.onChangeInput(event, 'password') }}
                                    className="form-control" type="password" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input
                                    value={firstName}
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input
                                    value={lastName}
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input
                                    value={phoneNumber}
                                    onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input
                                    value={address}
                                    onChange={(event) => { this.onChangeInput(event, 'address') }}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select
                                    value={gender}
                                    onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                    className="form-control">
                                    {genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select
                                    value={position}
                                    onChange={(event) => { this.onChangeInput(event, 'position') }}
                                    className="form-control">
                                    {positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select
                                    value={role}
                                    onChange={(event) => { this.onChangeInput(event, 'role') }}
                                    className="form-control">
                                    {roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className="preview-img-container">
                                    <input
                                        onChange={(event) => { this.handleOnChangeImage(event) }}
                                        id="previewImg" type="file" hidden />
                                    <label className="label-upload" htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i>
                                    </label>

                                    <div style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => { this.openPreviewImage() }}
                                        className="preview-image">

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button
                                    onClick={() => { this.handleSaveUser() }}
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id="manage-user.edit" /> : <FormattedMessage id="manage-user.save" />}

                                </button>
                            </div>
                            <div className="col-12 mb-5">
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // redux
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data)),

        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
