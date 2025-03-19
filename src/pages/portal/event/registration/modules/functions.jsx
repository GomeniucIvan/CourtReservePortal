import {anyInList, equalString, toBoolean} from "@/utils/Utils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {countListItems} from "@/utils/ListUtils.jsx";

export const generateEventPostModel = (formik, isFamilyMember, setIsLoading,eventId, reservationId) => {
    let response = {};

    let familyMembers = [];
    let values = formik.values;
    let currentMember = {
        ...values.Members[0],
        PullOutReason: formik.values?.PullOutReason || '',
    };

    let registrationUdfs = [];

    if (isFamilyMember) {
        familyMembers = values.Members;

        if (!familyMembers.some(v => toBoolean(v.InitialCheck))) {
            if (!familyMembers.some(v => toBoolean(v.IsChecked))) {
                response = {
                    IsValid: false,
                    Message: 'At least one registrant is required.',
                };

                return response;
            }
        }
        
        //require to separate for post
        familyMembers = values.Members.filter(member => !equalString(member.OrganizationMemberId, currentMember.OrganizationMemberId));
    } else {
        currentMember = {
            ...currentMember,
            IsChecked: true,
        }
    }

    //Current Member
    if (toBoolean(currentMember?.IsChecked) && anyInList(currentMember.MemberUdfs)) {
        registrationUdfs.push({
            ...currentMember,
            Udfs: currentMember.MemberUdfs
        });
    }

    //Family Member
    if (anyInList(familyMembers)) {
        familyMembers.forEach((famMember) => {
            famMember.PullOutReason = formik.values?.PullOutReason || '';
            if (toBoolean(famMember?.IsChecked) && anyInList(famMember.MemberUdfs)) {
                registrationUdfs.push({
                    ...famMember,
                    Udfs: famMember.MemberUdfs
                });
            }
        })
    }

    //Guest
    if (anyInList(formik?.values.ReservationGuests)) {
        formik?.values.ReservationGuests.forEach((guest) => {
            registrationUdfs.push({
                ...guest,
                Udfs: guest.MemberUdfs,
                GuestGuid: guest.Guid,
            });
        })
    }

    let postModel = {
        CurrentMember: currentMember,
        FamilyMembers: familyMembers,
        ReservationGuests: formik.values.ReservationGuests,
        MemberUdfs: registrationUdfs,
        Udfs: registrationUdfs,
        EventId: eventId,
        SelectedNumberOfGuests: countListItems(formik.values.ReservationGuests),
        SelectedReservation: {
            Id: reservationId
        }
    }

    response = {
        IsValid: true,
        PostModel: postModel,
    };
    
    return response;
}